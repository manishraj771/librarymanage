# 📚 College Library Management System

A full-featured **Library Management System** built with **React.js** (frontend) and **Node.js/Express.js** (backend), designed specifically for college libraries. It offers smooth book tracking, student record handling, and issuance management.

---

## 🚀 Features Overview

### 📘 Book Management

* ✅ Add, update, and delete books
* ✅ Search by title, author, and category
* ✅ Category-based filtering & pagination
* ✅ Track total vs available copies

### 👨‍🎓 Student Management

* ✅ Register and update student info
* ✅ Search by name, roll number, phone, department, semester
* ✅ View student-issued books with due dates

### 🔁 Book Issue & Return

* ✅ Issue books with due date tracking
* ✅ Book return functionality
* ✅ View overdue books
* ✅ Validate availability before issue
* ✅ Maintain issue history and usage stats

### 📊 Dashboard & Analytics

* ✅ Live issue/return stats
* ✅ Overdue alerts
* ✅ Recent transactions
* ✅ Quick actions and shortcuts

---

## 🛠 Tech Stack

### Frontend

* **React.js** (with React Router)
* **Tailwind CSS**
* **Lucide React** (Icons)
* **Axios**

### Backend

* **Node.js** / **Express.js**
* **MongoDB** with **Mongoose** ODM
* **express-validator**, **cors**, **helmet**

---

## 🧱 Project Structure (Tree)

```
college-library-management-system/
├── backend/
│   
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── 
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   └── vite.config.js
├── README.md
├── package.json
└── docs/
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd college-library-management-system
```

### 2. Backend Setup (MongoDB)

```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT_SECRET to .env
npm run dev
```

### 3. Frontend Setup

```bash
cd ..
npm install
npm run dev
```

### 4. Access Application

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000/api`

---

## 🗄️ Database Schema (MongoDB)

### Books Collection

```js
{
  _id,
  title,
  author,
  isbn,
  totalCopies,
  availableCopies,
  category,
  createdAt,
  updatedAt
}
```

### Students Collection

```js
{
  _id,
  name,
  rollNumber,
  department,
  semester,
  phone,
  email,
  createdAt,
  updatedAt
}
```

### Issues Collection

```js
{
  _id,
  book: ObjectId (ref to Books),
  student: ObjectId (ref to Students),
  issueDate,
  dueDate,
  returnDate,
  status: 'issued' | 'returned' | 'overdue',
  createdAt,
  updatedAt
}
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/auth/login`
* `POST /api/auth/register`

### Books

* `GET /api/books`
* `GET /api/books/:id`
* `POST /api/books`
* `PUT /api/books/:id`
* `DELETE /api/books/:id`
* `GET /api/books/meta/categories`

### Students

* `GET /api/students`
* `GET /api/students/:id`
* `GET /api/students/:id/issued-books`
* `POST /api/students`
* `PUT /api/students/:id`
* `DELETE /api/students/:id`
* `GET /api/students/meta/departments`

### Issues

* `GET /api/issues`
* `POST /api/issues`
* `PUT /api/issues/:id/return`
* `GET /api/issues/overdue`
* `GET /api/issues/stats`

---

## 🎨 UI Features

* 🖥 Responsive design
* 🔎 Real-time search/filter
* ⏳ Pagination
* ✅ Form validation
* 📈 Dashboard insights
* 📚 Clean typography & layout

---

## 🔒 Security Highlights

* Input sanitization with `express-validator`
* Secure headers with `helmet`
* CORS handling
* JWT-based authentication
* Token stored in localStorage

---

## 🧪 Sample Data

* 5 sample books
* 4 students
* No issued books by default (clean start)

---

## 🚀 Deployment Guide

### Backend

* Deploy MongoDB (Mongo Atlas / self-hosted)
* Use PM2 or Docker

### Frontend

```bash
npm run build
```



---

## 🙌 Contributing

1. Fork the repo
2. `git checkout -b feature/my-feature`
3. Commit and push
4. Open Pull Request

---




