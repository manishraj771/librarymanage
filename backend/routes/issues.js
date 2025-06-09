import express from 'express';
import mongoose from 'mongoose';
import { Book, Student, BookIssue } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateIssue, validatePagination, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all issues with pagination
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { status, student_id, book_id } = req.query;
  
  // Build search query
  let searchQuery = {};
  
  if (status) {
    searchQuery.status = status;
  }
  
  if (student_id) {
    searchQuery.student_id = student_id;
  }
  
  if (book_id) {
    searchQuery.book_id = book_id;
  }
  
  // Get total count
  const totalIssues = await BookIssue.countDocuments(searchQuery);
  
  // Get issues with pagination and populate related data
  const issues = await BookIssue.find(searchQuery)
    .populate('book_id', 'title author isbn')
    .populate('student_id', 'name roll_number department')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  // Transform the data to match frontend expectations
  const transformedIssues = issues.map(issue => ({
    id: issue._id,
    issue_date: issue.issue_date,
    due_date: issue.due_date,
    return_date: issue.return_date,
    status: issue.status,
    book_title: issue.book_id.title,
    book_author: issue.book_id.author,
    isbn: issue.book_id.isbn,
    student_name: issue.student_id.name,
    roll_number: issue.student_id.roll_number,
    department: issue.student_id.department,
    is_overdue: issue.status === 'issued' && issue.due_date < new Date()
  }));
  
  const totalPages = Math.ceil(totalIssues / limit);
  
  res.json({
    success: true,
    data: {
      issues: transformedIssues,
      pagination: {
        currentPage: page,
        totalPages,
        totalIssues,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}));

// Issue a book
router.post('/', validateIssue, asyncHandler(async (req, res) => {
  const { book_id, student_id, due_date } = req.body;
  
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Check if book exists and has available copies
      const book = await Book.findById(book_id).session(session);
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (book.available_copies <= 0) {
        throw new Error('No copies available for this book');
      }
      
      // Check if student exists
      const student = await Student.findById(student_id).session(session);
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      // Check if student already has this book
      const existingIssue = await BookIssue.findOne({
        book_id,
        student_id,
        status: 'issued'
      }).session(session);
      
      if (existingIssue) {
        throw new Error('Student already has this book issued');
      }
      
      // Create the issue record
      const bookIssue = new BookIssue({
        book_id,
        student_id,
        due_date: new Date(due_date)
      });
      
      await bookIssue.save({ session });
      
      // Update available copies
      await Book.findByIdAndUpdate(
        book_id,
        { $inc: { available_copies: -1 } },
        { session }
      );
      
      res.status(201).json({
        success: true,
        message: 'Book issued successfully',
        data: bookIssue
      });
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}));

// Return a book
router.put('/:id/return', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Get the issue record
      const issue = await BookIssue.findOne({
        _id: id,
        status: 'issued'
      }).session(session);
      
      if (!issue) {
        throw new Error('Issue record not found or book already returned');
      }
      
      // Update the issue record
      issue.status = 'returned';
      issue.return_date = new Date();
      await issue.save({ session });
      
      // Update available copies
      await Book.findByIdAndUpdate(
        issue.book_id,
        { $inc: { available_copies: 1 } },
        { session }
      );
      
      res.json({
        success: true,
        message: 'Book returned successfully',
        data: issue
      });
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}));

// Get overdue books
router.get('/overdue', asyncHandler(async (req, res) => {
  const overdueIssues = await BookIssue.find({
    status: 'issued',
    due_date: { $lt: new Date() }
  })
  .populate('book_id', 'title author')
  .populate('student_id', 'name roll_number email phone')
  .sort({ due_date: 1 })
  .lean();
  
  // Transform the data
  const transformedOverdue = overdueIssues.map(issue => ({
    id: issue._id,
    issue_date: issue.issue_date,
    due_date: issue.due_date,
    book_title: issue.book_id.title,
    book_author: issue.book_id.author,
    student_name: issue.student_id.name,
    roll_number: issue.student_id.roll_number,
    email: issue.student_id.email,
    phone: issue.student_id.phone,
    overdue_duration: new Date() - issue.due_date
  }));
  
  res.json({
    success: true,
    data: transformedOverdue
  });
}));

// Get issue statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await BookIssue.aggregate([
    {
      $group: {
        _id: null,
        currently_issued: {
          $sum: { $cond: [{ $eq: ['$status', 'issued'] }, 1, 0] }
        },
        total_returned: {
          $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$status', 'issued'] },
                  { $lt: ['$due_date', new Date()] }
                ]
              },
              1,
              0
            ]
          }
        },
        total_issues: { $sum: 1 }
      }
    }
  ]);
  
  const result = stats[0] || {
    currently_issued: 0,
    total_returned: 0,
    overdue: 0,
    total_issues: 0
  };
  
  res.json({
    success: true,
    data: result
  });
}));

export default router;