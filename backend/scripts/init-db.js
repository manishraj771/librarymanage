import pool from '../config/database.js';

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Create tables
    await pool.query(`
      -- Books table
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        total_copies INTEGER NOT NULL DEFAULT 1,
        available_copies INTEGER NOT NULL DEFAULT 1,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      -- Students table
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roll_number VARCHAR(50) UNIQUE NOT NULL,
        department VARCHAR(100) NOT NULL,
        semester INTEGER NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      -- Book issues table
      CREATE TABLE IF NOT EXISTS book_issues (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        issue_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        return_date TIMESTAMP WITH TIME ZONE NULL,
        status VARCHAR(20) DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
      CREATE INDEX IF NOT EXISTS idx_students_roll ON students(roll_number);
      CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
      CREATE INDEX IF NOT EXISTS idx_issues_status ON book_issues(status);
      CREATE INDEX IF NOT EXISTS idx_issues_due_date ON book_issues(due_date);
    `);

    // Create trigger to update updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_books_updated_at ON books;
      CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_students_updated_at ON students;
      CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_issues_updated_at ON book_issues;
      CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON book_issues
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Insert sample data
    await insertSampleData();

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await pool.end();
  }
};

const insertSampleData = async () => {
  try {
    // Sample books
    const books = [
      { title: 'Data Structures and Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', total_copies: 5, category: 'Computer Science' },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', total_copies: 3, category: 'Programming' },
      { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', total_copies: 4, category: 'Software Engineering' },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', total_copies: 6, category: 'Database' },
      { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', total_copies: 4, category: 'Networking' }
    ];

    for (const book of books) {
      await pool.query(`
        INSERT INTO books (title, author, isbn, total_copies, available_copies, category)
        VALUES ($1, $2, $3, $4, $4, $5)
        ON CONFLICT (isbn) DO NOTHING
      `, [book.title, book.author, book.isbn, book.total_copies, book.category]);
    }

    // Sample students
    const students = [
      { name: 'John Doe', roll_number: 'CS2021001', department: 'Computer Science', semester: 6, phone: '9876543210', email: 'john.doe@college.edu' },
      { name: 'Jane Smith', roll_number: 'CS2021002', department: 'Computer Science', semester: 6, phone: '9876543211', email: 'jane.smith@college.edu' },
      { name: 'Mike Johnson', roll_number: 'IT2021001', department: 'Information Technology', semester: 4, phone: '9876543212', email: 'mike.johnson@college.edu' },
      { name: 'Sarah Wilson', roll_number: 'CS2020001', department: 'Computer Science', semester: 8, phone: '9876543213', email: 'sarah.wilson@college.edu' }
    ];

    for (const student of students) {
      await pool.query(`
        INSERT INTO students (name, roll_number, department, semester, phone, email)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (roll_number) DO NOTHING
      `, [student.name, student.roll_number, student.department, student.semester, student.phone, student.email]);
    }

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

initDatabase();