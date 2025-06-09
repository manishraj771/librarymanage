import mongoose from 'mongoose';

const bookIssueSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  issue_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  return_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if book is overdue
bookIssueSchema.virtual('is_overdue').get(function() {
  return this.status === 'issued' && this.due_date < new Date();
});

// Index for better query performance
bookIssueSchema.index({ book_id: 1 });
bookIssueSchema.index({ student_id: 1 });
bookIssueSchema.index({ status: 1 });
bookIssueSchema.index({ due_date: 1 });
bookIssueSchema.index({ issue_date: -1 });

// Compound index for common queries
bookIssueSchema.index({ student_id: 1, status: 1 });
bookIssueSchema.index({ book_id: 1, status: 1 });

// Pre-save middleware to update status based on due date
bookIssueSchema.pre('save', function(next) {
  if (this.status === 'issued' && this.due_date < new Date()) {
    this.status = 'overdue';
  }
  next();
});

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

export default BookIssue;