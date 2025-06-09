import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [255, 'Author name cannot exceed 255 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9-]+$/.test(v);
      },
      message: 'ISBN must contain only numbers and hyphens'
    }
  },
  total_copies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: [1, 'Total copies must be at least 1'],
    default: 1
  },
  available_copies: {
    type: Number,
    required: true,
    min: [0, 'Available copies cannot be negative'],
    default: function() {
      return this.total_copies;
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for issued copies
bookSchema.virtual('issued_copies').get(function() {
  return this.total_copies - this.available_copies;
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', category: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ isbn: 1 });

// Pre-save middleware to ensure available_copies doesn't exceed total_copies
bookSchema.pre('save', function(next) {
  if (this.available_copies > this.total_copies) {
    this.available_copies = this.total_copies;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;