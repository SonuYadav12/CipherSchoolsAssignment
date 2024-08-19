import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
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
      } catch (err) {
        console.error('Error fetching test:', err);
      }
    };

    fetchTest();
  }, [id]);

  const handleAnswerChange = (qIndex, oIndex) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [qIndex]: oIndex,
    }));
  };

  const handleSubmit = async () => {
    try {
      let calculatedScore = 0;

      test.questions.forEach((q, qIndex) => {
        if (answers[qIndex] === q.correctOptionIndex) {
          calculatedScore += 10;
        }
      });

      setScore(calculatedScore);

      await axios.post(`http://localhost:3000/api/tests/${id}/submit`, { score }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      await axios.post('http://localhost:3000/api/sendEmail', {
        to: localStorage.getItem('userEmail'),
        subject: 'Test Results',
        text: `You scored ${calculatedScore} points on the test.`,
      });

      alert('Test submitted! Check your email for the results.');
      navigate('/');
    } catch (err) {
      console.error('Error submitting test:', err);
    }
  };

  if (!test) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-6">{test.title}</h2>
        <p>{test.description}</p>
        <WebcamCapture />
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {test.questions.map((q, qIndex) => (
            <div key={qIndex} className="border-t border-gray-300 pt-4">
              <h3 className="text-xl font-semibold">{q.questionText}</h3>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswerChange(qIndex, oIndex)}
                    className="mr-2"
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 mt-4"
          >
            Submit Test
          </button>
        </form>
      </div>
    </div>
  );
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
      />
      <button onClick={() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log('Screenshot taken:', imageSrc);
      }}>
        Capture Photo
      </button>
    </div>
  );
};

export default TestPage;
