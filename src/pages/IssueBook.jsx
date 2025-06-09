import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search } from 'lucide-react';
import { issuesAPI, booksAPI, studentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const IssueBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchingBooks, setSearchingBooks] = useState(false);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [formData, setFormData] = useState({
    book_id: '',
    student_id: '',
    due_date: ''
  });
  const [errors, setErrors] = useState({});
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setFormData(prev => ({
      ...prev,
      due_date: defaultDueDate.toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    if (bookSearch.length >= 2) {
      searchBooks();
    } else {
      setBooks([]);
    }
  }, [bookSearch]);

  useEffect(() => {
    if (studentSearch.length >= 2) {
      searchStudents();
    } else {
      setStudents([]);
    }
  }, [studentSearch]);

  const searchBooks = async () => {
    try {
      setSearchingBooks(true);
      const response = await booksAPI.getAll({
        title: bookSearch,
        limit: 10
      });
      if (response.success) {
        const validBooks = response.data.books.filter(book => book?.id && book.available_copies > 0);
        setBooks(validBooks);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setSearchingBooks(false);
    }
  };

  const searchStudents = async () => {
    try {
      setSearchingStudents(true);
      const response = await studentsAPI.getAll({
        name: studentSearch,
        limit: 10
      });
      if (response.success) {
        const validStudents = response.data.students.filter(student => student?.id);
        setStudents(validStudents);
      }
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setSearchingStudents(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.book_id) newErrors.book_id = 'Please select a book';
    if (!formData.student_id) newErrors.student_id = 'Please select a student';

    const dueDate = new Date(formData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else if (dueDate <= today) {
      newErrors.due_date = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const issueData = {
        ...formData,
        book_id: parseInt(formData.book_id),
        student_id: parseInt(formData.student_id),
        due_date: new Date(formData.due_date).toISOString()
      };
      const response = await issuesAPI.create(issueData);
      if (response.success) {
        navigate('/issues', {
          state: { message: 'Book issued successfully!' }
        });
      }
    } catch (error) {
      if (error.errors) {
        const fieldErrors = {};
        error.errors.forEach(err => {
          fieldErrors[err.path] = err.msg;
        });
        setErrors(fieldErrors);
      } else {
        alert(error.message || 'Error issuing book');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = books.find(book => book.id === parseInt(formData.book_id));
  const selectedStudent = students.find(student => student.id === parseInt(formData.student_id));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/issues')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Issues
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Issue Book</h1>
        <p className="mt-1 text-sm text-gray-600">
          Issue a book to a student by selecting the book and student.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Book Selection */}
          <div>
            <label htmlFor="book_search" className="block text-sm font-medium text-gray-700 mb-2">
              Select Book *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="book_search"
                placeholder="Search for books by title..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
              {searchingBooks && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>

            {books.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {books.map(book => (
                  <div
                    key={book.id}
                    onClick={() => {
                      if (book?.id != null) {
                        setFormData(prev => ({ ...prev, book_id: book.id.toString() }));
                        setBookSearch(book.title);
                        setBooks([]);
                      }
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">by {book.author}</div>
                    <div className="text-xs text-gray-400">
                      Available: {book.available_copies}/{book.total_copies} copies
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBook && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="font-medium text-purple-900">{selectedBook.title}</div>
                <div className="text-sm text-purple-700">by {selectedBook.author}</div>
                <div className="text-xs text-purple-600">
                  ISBN: {selectedBook.isbn} | Available: {selectedBook.available_copies} copies
                </div>
              </div>
            )}
            {errors.book_id && <p className="mt-1 text-sm text-red-600">{errors.book_id}</p>}
          </div>

          {/* Student Selection */}
          <div>
            <label htmlFor="student_search" className="block text-sm font-medium text-gray-700 mb-2">
              Select Student *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="student_search"
                placeholder="Search for students by name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
              {searchingStudents && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>

            {students.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {students.map(student => (
                  <div
                    key={student.id}
                    onClick={() => {
                      if (student?.id != null) {
                        setFormData(prev => ({ ...prev, student_id: student.id.toString() }));
                        setStudentSearch(student.name);
                        setStudents([]);
                      }
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Roll: {student.roll_number}</div>
                    <div className="text-xs text-gray-400">
                      {student.department} | Semester {student.semester}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedStudent && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="font-medium text-green-900">{selectedStudent.name}</div>
                <div className="text-sm text-green-700">Roll: {selectedStudent.roll_number}</div>
                <div className="text-xs text-green-600">
                  {selectedStudent.department} | Semester {selectedStudent.semester}
                </div>
              </div>
            )}
            {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              id="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.due_date
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
              }`}
            />
            {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/issues')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;
