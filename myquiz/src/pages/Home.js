import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
        <Link
          to="/test"
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Take a Test
        </Link>
      </div>
    </div>
  );
};

export default Home;
