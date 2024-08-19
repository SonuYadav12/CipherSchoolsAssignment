import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const StudentHome = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTests(response.data);
      } catch (err) {
        console.error('Error fetching tests:', err);
      }
    };

    fetchTests();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-6">
        <button
          onClick={handleLogout}
          className="mb-6 w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
        >
          Logout
        </button>
        <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
        <ul className="space-y-4">
          {tests.map(test => (
            <li key={test._id} className="border-b border-gray-300 pb-4">
              <h3 className="text-xl font-semibold">{test.title}</h3>
              <p>{test.description}</p>
              <Link to={`/test/${test._id}`} className="text-blue-500 hover:underline">Take Test</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentHome;
