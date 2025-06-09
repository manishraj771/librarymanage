import express from 'express';
import { Student, BookIssue } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateStudent, validatePagination, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all students with search and pagination
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { name, roll_number, phone, department, semester } = req.query;
  
  // Build search query
  let searchQuery = {};
  
  if (name || roll_number || phone || department || semester) {
    searchQuery.$and = [];
    
    if (name) {
      searchQuery.$and.push({
        name: { $regex: name, $options: 'i' }
      });
    }
    
    if (roll_number) {
      searchQuery.$and.push({
        roll_number: { $regex: roll_number, $options: 'i' }
      });
    }
    
    if (phone) {
      searchQuery.$and.push({
        phone: { $regex: phone, $options: 'i' }
      });
    }
    
    if (department) {
      searchQuery.$and.push({
        department: { $regex: department, $options: 'i' }
      });
    }
    
    if (semester) {
      searchQuery.$and.push({
        semester: parseInt(semester)
      });
    }
  }
  
  // Get total count
  const totalStudents = await Student.countDocuments(searchQuery);
  
  // Get students with pagination
  const students = await Student.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  const totalPages = Math.ceil(totalStudents / limit);
  
  res.json({
    success: true,
    data: {
      students,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}));

// Get student by ID
router.get('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const student = await Student.findById(id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  res.json({
    success: true,
    data: student
  });
}));

// Get student's issued books
router.get('/:id/issued-books', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if student exists
  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  const issuedBooks = await BookIssue.find({
    student_id: id,
    status: 'issued'
  })
  .populate('book_id', 'title author isbn')
  .sort({ issue_date: -1 })
  .lean();
  
  // Transform the data to match frontend expectations
  const transformedBooks = issuedBooks.map(issue => ({
    issue_id: issue._id,
    book_id: issue.book_id._id,
    title: issue.book_id.title,
    author: issue.book_id.author,
    isbn: issue.book_id.isbn,
    issue_date: issue.issue_date,
    due_date: issue.due_date,
    status: issue.status,
    is_overdue: issue.due_date < new Date()
  }));
  
  res.json({
    success: true,
    data: transformedBooks
  });
}));

// Add new student
router.post('/', validateStudent, asyncHandler(async (req, res) => {
  const { name, roll_number, department, semester, phone, email } = req.body;
  
  const student = new Student({
    name,
    roll_number,
    department,
    semester,
    phone,
    email
  });
  
  await student.save();
  
  res.status(201).json({
    success: true,
    message: 'Student added successfully',
    data: student
  });
}));

// Update student
router.put('/:id', validateId, validateStudent, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, roll_number, department, semester, phone, email } = req.body;
  
  const student = await Student.findByIdAndUpdate(
    id,
    { name, roll_number, department, semester, phone, email },
    { new: true, runValidators: true }
  );
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Student updated successfully',
    data: student
  });
}));

// Delete student
router.delete('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if student has active issues
  const activeIssues = await BookIssue.countDocuments({
    student_id: id,
    status: 'issued'
  });
  
  if (activeIssues > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete student with active book issues'
    });
  }
  
  const student = await Student.findByIdAndDelete(id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
}));

// Get departments
router.get('/meta/departments', asyncHandler(async (req, res) => {
  const departments = await Student.distinct('department');
  
  res.json({
    success: true,
    data: departments.sort()
  });
}));

export default router;