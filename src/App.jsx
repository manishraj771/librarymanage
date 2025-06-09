import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Issues from './pages/Issues';
import AddBook from './pages/AddBook';
import AddStudent from './pages/AddStudent';
import IssueBook from './pages/IssueBook';
import BookDetail from './pages/BookDetail';
import StudentDetail from './pages/StudentDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/new" element={<IssueBook />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;