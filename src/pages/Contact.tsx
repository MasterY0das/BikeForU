import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-md w-full mx-4 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-lg mb-2">For any queries or support, please email:</p>
        <p className="text-green-600 font-semibold text-lg">nikhil9kalburgi@gmail.com</p>
      </div>
    </div>
  );
};

export default Contact; 