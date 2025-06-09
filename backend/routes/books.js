import express from 'express';
import { Book, BookIssue } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBook, validatePagination, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all books with search and pagination
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { title, author, category } = req.query;
  
  // Build search query
  let searchQuery = {};
  
  if (title || author || category) {
    searchQuery.$and = [];
    
    if (title) {
      searchQuery.$and.push({
        title: { $regex: title, $options: 'i' }
      });
    }
    
    if (author) {
      searchQuery.$and.push({
        author: { $regex: author, $options: 'i' }
      });
    }
    
    if (category) {
      searchQuery.$and.push({
        category: { $regex: category, $options: 'i' }
      });
    }
  }
  
  // Get total count
  const totalBooks = await Book.countDocuments(searchQuery);
  
  // Get books with pagination
  const books = await Book.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  const totalPages = Math.ceil(totalBooks / limit);
  
  res.json({
    success: true,
    data: {
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}));

// Get book by ID
router.get('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const book = await Book.findById(id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.json({
    success: true,
    data: book
  });
}));

// Add new book
router.post('/', validateBook, asyncHandler(async (req, res) => {
  const { title, author, isbn, total_copies, category } = req.body;
  
  const book = new Book({
    title,
    author,
    isbn,
    total_copies,
    available_copies: total_copies,
    category
  });
  
  await book.save();
  
  res.status(201).json({
    success: true,
    message: 'Book added successfully',
    data: book
  });
}));

// Update book
router.put('/:id', validateId, validateBook, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, total_copies, category } = req.body;
  
  const book = await Book.findById(id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  // Calculate new available copies
  const issuedCopies = book.total_copies - book.available_copies;
  const newAvailableCopies = total_copies - issuedCopies;
  
  if (newAvailableCopies < 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot reduce total copies below currently issued copies'
    });
  }
  
  book.title = title;
  book.author = author;
  book.isbn = isbn;
  book.total_copies = total_copies;
  book.available_copies = newAvailableCopies;
  book.category = category;
  
  await book.save();
  
  res.json({
    success: true,
    message: 'Book updated successfully',
    data: book
  });
}));

// Delete book
router.delete('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if book has active issues
  const activeIssues = await BookIssue.countDocuments({
    book_id: id,
    status: 'issued'
  });
  
  if (activeIssues > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete book with active issues'
    });
  }
  
  const book = await Book.findByIdAndDelete(id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Book deleted successfully'
  });
}));

// Get book categories
router.get('/meta/categories', asyncHandler(async (req, res) => {
  const categories = await Book.distinct('category');
  
  res.json({
    success: true,
    data: categories.sort()
  });
}));

export default router;