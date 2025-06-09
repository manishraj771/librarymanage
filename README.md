# College Library Management System

A comprehensive fullstack library management system built with React.js frontend and Node.js/Express.js backend, designed for small college libraries to efficiently manage books, students, and book issuance.

## 🚀 Features

### Book Management
- ✅ Add, update, and delete books
- ✅ Search and filter by title, author, and category
- ✅ Pagination support for large collections
- ✅ Track total and available copies
- ✅ Category-based organization

### Student Management
- ✅ Complete student registration system
- ✅ Search by name, roll number, phone, department, and semester
- ✅ Department and semester filtering
- ✅ View student's issued books and due dates
- ✅ Contact information management

### Book Issue & Return System
- ✅ Issue books to students with due date tracking
- ✅ Return book functionality
- ✅ Overdue book identification and tracking
- ✅ Issue history and statistics
- ✅ Availability validation before issuing

### Dashboard & Analytics
- ✅ Real-time statistics dashboard
- ✅ Recent issues tracking
- ✅ Overdue books monitoring
- ✅ Quick action shortcuts

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Backend Setup
```bash
# Install backend dependencies
cd backend
npm install

# Create PostgreSQL database
createdb library_db

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database schema and sample data
npm run init-db

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Install frontend dependencies (from root directory)
npm install

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### Books Table
```sql
- id (Primary Key)
- title (VARCHAR)
- author (VARCHAR)
- isbn (VARCHAR, Unique)
- total_copies (INTEGER)
- available_copies (INTEGER)
- category (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Students Table
```sql
- id (Primary Key)
- name (VARCHAR)
- roll_number (VARCHAR, Unique)
- department (VARCHAR)
- semester (INTEGER)
- phone (VARCHAR)
- email (VARCHAR, Unique)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Book Issues Table
```sql
- id (Primary Key)
- book_id (Foreign Key → books.id)
- student_id (Foreign Key → students.id)
- issue_date (TIMESTAMP)
- due_date (TIMESTAMP)
- return_date (TIMESTAMP, Nullable)
- status (ENUM: 'issued', 'returned', 'overdue')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Books API
- `GET /api/books` - Get all books with filtering and pagination
- `GET /api/books/:id` - Get specific book details
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/meta/categories` - Get all categories

### Students API
- `GET /api/students` - Get all students with filtering and pagination
- `GET /api/students/:id` - Get specific student details
- `GET /api/students/:id/issued-books` - Get student's issued books
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/meta/departments` - Get all departments

### Issues API
- `GET /api/issues` - Get all issues with filtering and pagination
- `POST /api/issues` - Issue a book to student
- `PUT /api/issues/:id/return` - Return a book
- `GET /api/issues/overdue` - Get overdue books
- `GET /api/issues/stats` - Get issue statistics

## 🎨 UI Features

### Modern Design
- Clean, professional interface with Tailwind CSS
- Responsive design for desktop and mobile
- Intuitive navigation with sidebar layout
- Consistent color scheme and typography

### User Experience
- Real-time search and filtering
- Pagination for large datasets
- Loading states and error handling
- Form validation with helpful error messages
- Quick action buttons and shortcuts

### Dashboard
- Statistics cards showing key metrics
- Recent issues timeline
- Overdue books alerts
- Quick access to common actions

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Rate limiting
- Helmet.js security headers
- Environment variable protection

## 📊 Sample Data

The system includes sample data for testing:
- 5 sample books across different categories
- 4 sample students from various departments
- No initial book issues (clean slate)

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database on your server
2. Configure environment variables
3. Run database migrations
4. Deploy using PM2 or similar process manager

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- None currently reported

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the API documentation in the backend README

## 🔮 Future Enhancements

- Email notifications for overdue books
- Book reservation system
- Advanced reporting and analytics
- Barcode scanning integration
- Mobile app development
- Multi-library support

---

**Built with ❤️ for educational institutions**