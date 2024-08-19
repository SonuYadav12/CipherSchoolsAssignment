// pages/Test.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/tests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        setTest(response.data);
        setAnswers(response.data.questions.map(() => '')); 
      } catch (err) {
        console.error('Error fetching test:', err);
      }
    };

    fetchTest();
  }, [id]);

  const handleAnswerChange = (index, value) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/tests/submit', { testId: id, answers }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      toast.success('Test submitted successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/home');
    } catch (err) {
      console.error('Error submitting test:', err);
      toast.error('Failed to submit test.', {
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

  if (!test) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-6">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6">{test.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {test.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{question.question}</p>
              {question.options.map(option => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Test;
