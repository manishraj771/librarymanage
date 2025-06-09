import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book, Student, BookIssue } from '../models/index.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Connected to MongoDB for seeding...');

    // Clear existing data
    await Book.deleteMany({});
    await Student.deleteMany({});
    await BookIssue.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Sample books
    const books = [
      { title: 'Data Structures and Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', total_copies: 5, available_copies: 5, category: 'Computer Science' },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', total_copies: 3, available_copies: 3, category: 'Programming' },
      { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', total_copies: 4, available_copies: 4, category: 'Software Engineering' },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', total_copies: 6, available_copies: 6, category: 'Database' },
      { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', total_copies: 4, available_copies: 4, category: 'Networking' }
    ];

    const createdBooks = await Book.insertMany(books);
    console.log('📚 Sample books created');

    // Sample students
    const students = [
      { name: 'John Doe', roll_number: 'CS2021001', department: 'Computer Science', semester: 6, phone: '9876543210', email: 'john.doe@college.edu' },
      { name: 'Jane Smith', roll_number: 'CS2021002', department: 'Computer Science', semester: 6, phone: '9876543211', email: 'jane.smith@college.edu' },
      { name: 'Mike Johnson', roll_number: 'IT2021001', department: 'Information Technology', semester: 4, phone: '9876543212', email: 'mike.johnson@college.edu' },
      { name: 'Sarah Wilson', roll_number: 'CS2020001', department: 'Computer Science', semester: 8, phone: '9876543213', email: 'sarah.wilson@college.edu' }
    ];

    const createdStudents = await Student.insertMany(students);
    console.log('👥 Sample students created');

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Created ${createdBooks.length} books and ${createdStudents.length} students`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedData();