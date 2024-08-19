import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: [''], correctOptionIndex: null }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index].question = event.target.value;
      return newQuestions;
    });
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[qIndex].options[oIndex] = event.target.value;
      return newQuestions;
    });
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[qIndex].correctOptionIndex = oIndex;
      return newQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, { question: '', options: [''], correctOptionIndex: null }]);
  };

  const removeQuestion = (index) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[qIndex].options.push('');
      return newQuestions;
    });
  };

  const removeOption = (qIndex, oIndex) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      if (newQuestions[qIndex].correctOptionIndex === oIndex) {
        newQuestions[qIndex].correctOptionIndex = null;
      } else if (newQuestions[qIndex].correctOptionIndex > oIndex) {
        newQuestions[qIndex].correctOptionIndex -= 1;
      }
      return newQuestions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
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

      console.log('Submitting data:', testData); 

      const response = await axios.post('http://localhost:3000/api/tests/create', 
        testData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Test created:', response.data);
      toast.success('Test created successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setQuestions([{ question: '', options: [''], correctOptionIndex: null }]);
    } catch (err) {
      console.error('Error creating test:', err.response ? err.response.data : err.message);
      toast.error('Failed to create test.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-6">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6">Create New Test</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-3 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
