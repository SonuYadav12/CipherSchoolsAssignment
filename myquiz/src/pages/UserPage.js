import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">User Profile</h2>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user?.name || 'User Name'}</h3>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Information</h3>
          <p className="text-gray-700">Here you can add more details about the user, such as their role, registration date, or any other relevant information.</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
