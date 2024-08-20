import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Draggable from 'react-draggable';

const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/tests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTest(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
      } catch (err) {
        console.error('Error fetching test:', err);
        toast.error('Failed to load test. Please try again later.');
      }
    };

    fetchTest();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const validateAnswers = () => {
    return answers.every(answer => answer !== null);
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    if (isSubmitting) return; 

    setIsSubmitting(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();

      
      const response = await axios.post(`http://localhost:3000/api/tests/submit`, { testId: id, answers, imageSrc }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { score } = response.data;
      navigate(`/submit/${id}`, { state: { score } });
    } catch (err) {
      console.error('Error submitting test:', err);
      toast.error('Failed to submit test. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold text-gray-700">Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-6">
        <header className="flex flex-col items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-600 mb-2">{test.title}</h2>
          <p className="text-lg text-gray-800 mb-4">{test.description}</p>
        </header>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 mb-6">
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-900">Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {test.questions.map((q, index) => (
                <div key={index} className="border-b border-gray-300 pb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{q.questionText}</h3>
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center">
                        <input
                          type="radio"
                          id={`question-${index}-option-${optIndex}`}
                          name={`question-${index}`}
                          value={optIndex}
                          checked={answers[index] === optIndex}
                          onChange={() => handleAnswerChange(index, optIndex)}
                          className="mr-2 accent-blue-600"
                        />
                        <label htmlFor={`question-${index}-option-${optIndex}`} className="text-lg text-gray-800">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                type="submit" 
                className={`w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </form>
          </div>
          <Draggable>
            <div className="w-full md:w-1/3 flex justify-center items-center mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                className="border border-gray-300 rounded-lg"
              />
            </div>
          </Draggable>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
