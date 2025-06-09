import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Edit, Calendar, Tag } from 'lucide-react';
import { booksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      if (response.success) {
        setBook(response.data);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      if (error.message?.includes('not found')) {
        navigate('/books');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Book not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The book you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Books
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
          <button
            onClick={() => navigate(`/books/${book.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Book
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-start space-x-6">
            {/* Book Icon */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-sm text-gray-900">{book.category}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ISBN</p>
                    <p className="text-sm text-gray-900">{book.isbn}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Added On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(book.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="border-t border-gray-200 px-6 py-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Copies</p>
                  <p className="text-2xl font-bold text-blue-600">{book.total_copies}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Available</p>
                  <p className="text-2xl font-bold text-green-600">{book.available_copies}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">Issued</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {book.total_copies - book.available_copies}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                book.available_copies > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.available_copies > 0 ? 'Available for Issue' : 'Currently Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-sm text-gray-900">
                {new Date(book.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-sm text-gray-900">
                {new Date(book.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;