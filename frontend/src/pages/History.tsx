import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { historyAPI } from '../lib/api';

interface EditItem {
  _id: string;
  originalImageUrl: string;
  editedImageUrl: string;
  instruction: string;
  timestamp: string;
  metadata?: {
    processingTime?: number;
  };
}

export default function History() {
  const { user, logout, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<EditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [isAuthenticated, navigate]);

  const fetchHistory = async () => {
    try {
      const data = await historyAPI.getHistory(50, 0);
      setHistory(data.history);
    } catch {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this edit?')) return;

    try {
      await historyAPI.deleteEdit(id);
      setHistory(history.filter(item => item._id !== id));
    } catch {
      alert('Failed to delete edit');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) return;

    try {
      await historyAPI.clearHistory();
      setHistory([]);
    } catch {
      alert('Failed to clear history');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit History</h1>
            <p className="text-sm text-gray-600">View and manage your edits</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No edit history yet</h3>
            <p className="text-gray-600 mb-4">Start editing images to see your history here</p>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Start Editing
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {history.length} {history.length === 1 ? 'Edit' : 'Edits'}
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Clear All History
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50">
                    <img 
                      src={item.originalImageUrl} 
                      alt="Original" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <img 
                      src={item.editedImageUrl} 
                      alt="Edited" 
                      className="w-full h-32 object-cover rounded border-2 border-blue-200"
                    />
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
                      "{item.instruction}"
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(item.timestamp).toLocaleDateString()} at{' '}
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                    
                    <div className="flex gap-2">
                      <a
                        href={item.editedImageUrl}
                        download="edited-image.jpg"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition text-center"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
