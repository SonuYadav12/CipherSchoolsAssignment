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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
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

  // Anti-Cheating Measures
  useEffect(() => {
    // Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        toast.warning('Please stay on the test page.');
        // Log the tab switch or take action
      }
    };

    // Prevent Copy-Paste
    const handleCopy = (event) => {
      event.preventDefault();
      toast.error('Copying is disabled during the test.');
    };

    const handlePaste = (event) => {
      event.preventDefault();
      toast.error('Pasting is disabled during the test.');
    };

    // Disable Right-Click
    const handleContextMenu = (event) => {
      event.preventDefault();
      toast.error('Right-click is disabled during the test.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleAnswerChange = (value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = value;
      return newAnswers;
    });
    setHasAnswered(true);
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

  const handleNext = () => {
    if (hasAnswered) {
      setHasAnswered(false); 
      if (currentQuestionIndex < (test.questions.length - 1)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      toast.error('Please answer the current question to move forward.');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setHasAnswered(answers[currentQuestionIndex] !== null);
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

  const question = test.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <ToastContainer position="top-right" autoClose={5000} />
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
              <div className="border-b border-gray-300 pb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{question.questionText}</h3>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`question-${currentQuestionIndex}-option-${optIndex}`}
                        name={`question-${currentQuestionIndex}`}
                        value={optIndex}
                        checked={answers[currentQuestionIndex] === optIndex}
                        onChange={() => handleAnswerChange(optIndex)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`question-${currentQuestionIndex}-option-${optIndex}`} className="text-lg text-gray-800">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <button 
                  type="button"
                  onClick={handlePrevious}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Next
                </button>
              </div>
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
