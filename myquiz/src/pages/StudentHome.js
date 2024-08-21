import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSignOutAlt, FaTasks } from 'react-icons/fa';
import Navbar from '../pages/Navbar'; 

const StudentHome = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/tests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedTests = response.data.map(test => ({
          ...test,
          imageUrl: `https://picsum.photos/seed/${test._id}/300/200`,
        }));

        setTests(updatedTests);
      } catch (err) {
        console.error('Error fetching tests:', err);
        toast.error('Failed to fetch tests. Please try again later.', {
          position: 'top-center',
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [navigate]);

  const handleLogout = async () => {

    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    window.location.reload();
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
      <Navbar onLogout={handleLogout} />
      <ToastContainer />
      <div className="flex-grow w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-6 mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-gray-800 flex items-center">
            <FaTasks className="text-blue-600 mr-3" />
            Available Tests
          </h2>
        </header>
        {tests.length > 0 ? (
          <ul className="space-y-6">
            {tests.map(test => (
              <li
                key={test._id}
                className="border-b border-gray-300 pb-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-4"
              >
                <img
                  src={test.imageUrl}
                  alt={test.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold text-gray-900">{test.title}</h3>
                  <p className="text-gray-700 text-lg mb-4">{test.description}</p>
                  <Link
                    to={`/test/${test._id}`}
                    className="text-blue-600 hover:text-blue-700 text-lg font-medium"
                  >
                    Start Test
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600">No tests available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
