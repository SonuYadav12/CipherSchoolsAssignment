import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: [''], correctOptionIndex: null }]);
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        if (userData.role !== 'admin') {
          toast.error('Access denied. Admins only.', { position: 'top-center', autoClose: 2000 });
          navigate('/login');
          return;
        }
        setUser(userData);
        fetchTests(); 
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in again.', { position: 'top-center', autoClose: 2000 });
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(response.data);
    } catch (err) {
      console.error('Error fetching tests:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 403) {
        toast.error('Access forbidden: You do not have permission to view this resource.', {
          position: 'top-center',
          autoClose: 2000,
        });
      } else {
        toast.error(`Failed to fetch tests: ${err.response ? err.response.data.message : err.message}`, {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    }
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOptionIndex = oIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [''], correctOptionIndex: null }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    if (newQuestions[qIndex].correctOptionIndex === oIndex) {
      newQuestions[qIndex].correctOptionIndex = null;
    } else if (newQuestions[qIndex].correctOptionIndex > oIndex) {
      newQuestions[qIndex].correctOptionIndex -= 1;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found.', { position: 'top-center', autoClose: 2000 });
      return;
    }

    const testData = {
      title,
      description,
      questions: questions.map(q => ({
        questionText: q.question,
        options: q.options,
        correctOption: q.correctOptionIndex
      }))
    };

    try {
      await axios.post('http://localhost:3000/api/tests/create', testData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Test created successfully!', { position: 'top-center', autoClose: 2000 });
      setTitle('');
      setDescription('');
      setQuestions([{ question: '', options: [''], correctOptionIndex: null }]);
      fetchTests(); 
    } catch (err) {
      console.error('Error creating test:', err.response ? err.response.data : err.message);
      toast.error('Failed to create test.', { position: 'top-center', autoClose: 2000 });
    }
  };

  const handleLogout = async () => {

    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    window.location.reload();
};

  const handleDelete = async (testId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found.', { position: 'top-center', autoClose: 2000 });
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/tests/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Test deleted successfully!', { position: 'top-center', autoClose: 2000 });
      fetchTests(); 
    } catch (err) {
      console.error('Error deleting test:', err.response ? err.response.data : err.message);
      toast.error('Failed to delete test.', { position: 'top-center', autoClose: 2000 });
    }
  };

  const handleEdit = (testId) => {
    navigate(`/edit-test/${testId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Navbar user={user} onUserClick={() => navigate('/user')} onLogout={handleLogout} />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <ToastContainer />
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Test</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Test Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Test Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              rows="4"
              required
            />
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border-t border-gray-300 pt-4">
                <input
                  type="text"
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  className="w-full p-3 border border-gray-300 rounded mb-2"
                  required
                />
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="radio"
                      name={`correctOption-${qIndex}`}
                      checked={q.correctOptionIndex === oIndex}
                      onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                      className="ml-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="bg-red-500 text-white p-2 rounded ml-2"
                    >
                      Remove Option
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Add Option
                </button>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-red-500 text-white p-2 rounded mt-2 ml-2"
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white p-3 rounded mt-4"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 mt-4"
            >
              Create Test
            </button>
          </form>

          {/* Display tests */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Tests</h2>
            {tests.length === 0 ? (
              <p>No tests available.</p>
            ) : (
              <ul className="space-y-4">
                {tests.map(test => (
                  <li key={test._id} className="border border-gray-300 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{test.title}</h3>
                      <p>{test.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(test._id)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test._id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
