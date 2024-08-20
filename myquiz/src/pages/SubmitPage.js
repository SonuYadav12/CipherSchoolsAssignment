import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const SubmitPage = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const { score } = location.state || {}; 

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-green-200 via-green-300 to-green-400">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Test Result
        </h2>
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold text-gray-800">
            Your Score:
          </p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {score !== undefined ? score : 'No score available'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
