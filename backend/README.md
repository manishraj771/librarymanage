# Library Management System - Backend (MongoDB)

A RESTful API for managing books, students, and book issuance in a college library system using MongoDB.

## 🚀 Features

- **Book Management**: CRUD operations, search, and filtering
- **Student Management**: Complete student records with department tracking
- **Issue System**: Book issuance and return tracking
- **Advanced Search**: Filter by multiple criteria with pagination
- **Data Validation**: Comprehensive input validation and error handling
- **Database Security**: MongoDB with proper indexing and validation

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB service
   mongod
   
   # Seed sample data
   npm run seed
   ```

4. **Environment Variables**
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/library_db
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Books API

#### GET /api/books
Get all books with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `title` (optional): Filter by title (partial match)
- `author` (optional): Filter by author (partial match)
- `category` (optional): Filter by category (partial match)

**Example:**
```bash
GET /api/books?page=1&limit=10&title=algorithms&category=Computer%20Science
```

#### GET /api/books/:id
Get a specific book by ID.

#### POST /api/books
Add a new book.

**Request Body:**
```json
{
  "title": "Data Structures and Algorithms",
  "author": "Thomas H. Cormen",
  "isbn": "978-0262033848",
  "total_copies": 5,
  "category": "Computer Science"
}
```

#### PUT /api/books/:id
Update an existing book.

#### DELETE /api/books/:id
Delete a book (only if no active issues).

#### GET /api/books/meta/categories
Get all unique book categories.

### Students API

#### GET /api/students
Get all students with optional filtering and pagination.

**Query Parameters:**
- `page`, `limit`: Pagination
- `name`: Filter by name (partial match)
- `roll_number`: Filter by roll number (partial match)
- `phone`: Filter by phone (partial match)
- `department`: Filter by department
- `semester`: Filter by semester

#### GET /api/students/:id
Get a specific student by ID.

#### GET /api/students/:id/issued-books
Get all books currently issued to a student.

#### POST /api/students
Add a new student.

**Request Body:**
```json
{
  "name": "John Doe",
  "roll_number": "CS2021001",
  "department": "Computer Science",
  "semester": 6,
  "phone": "9876543210",
  "email": "john.doe@college.edu"
}
```

#### PUT /api/students/:id
Update an existing student.

#### DELETE /api/students/:id
Delete a student (only if no active issues).

#### GET /api/students/meta/departments
Get all unique departments.

### Issues API

#### GET /api/issues
Get all book issues with optional filtering and pagination.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (issued/returned)
- `student_id`: Filter by student ID
- `book_id`: Filter by book ID

#### POST /api/issues
Issue a book to a student.

**Request Body:**
```json
{
  "book_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "student_id": "60f7b3b3b3b3b3b3b3b3b3b4",
  "due_date": "2024-02-15T00:00:00.000Z"
}
```

#### PUT /api/issues/:id/return
Return a book.

#### GET /api/issues/overdue
Get all overdue books.

#### GET /api/issues/stats
Get issue statistics.

## 📊 Database Schema

### Books Collection
```javascript
{
  title: String (required, max: 255),
  author: String (required, max: 255),
  isbn: String (required, unique, pattern: /^[0-9-]+$/),
  total_copies: Number (required, min: 1),
  available_copies: Number (required, min: 0),
  category: String (required, max: 100),
  createdAt: Date,
  updatedAt: Date
}
```

### Students Collection
```javascript
{
  name: String (required, min: 2, max: 255),
  roll_number: String (required, unique, max: 50),
  department: String (required, max: 100),
  semester: Number (required, min: 1, max: 8),
  phone: String (required, pattern: /^[0-9]{10}$/),
  email: String (required, unique, email format),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Issues Collection
```javascript
{
  book_id: ObjectId (ref: 'Book', required),
  student_id: ObjectId (ref: 'Student', required),
  issue_date: Date (default: now),
  due_date: Date (required, future date),
  return_date: Date (nullable),
  status: String (enum: ['issued', 'returned', 'overdue']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if applicable)
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## 🚦 Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable in production environment

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention
- Request rate limiting

## 📝 Sample Data

The database seeding script includes sample data:
- 5 sample books across different categories
- 4 sample students from different departments
- No initial book issues

## 🐛 Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in environment variables

2. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing processes on port 5000

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided

## 📈 Performance Considerations

- MongoDB indexes on frequently queried fields
- Pagination for large datasets
- Connection pooling with Mongoose
- Compression middleware for response optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.