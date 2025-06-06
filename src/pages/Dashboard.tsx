import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                BikeForU
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/settings" className="text-gray-300 hover:text-white">
                Settings
              </Link>
              <Link to="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Placeholder Item 1 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Rides</h2>
            <p className="text-gray-400">
              Track your biking adventures and achievements.
            </p>
            <button className="mt-4 text-blue-400 hover:text-blue-300">
              View Rides →
            </button>
          </div>

          {/* Placeholder Item 2 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Community</h2>
            <p className="text-gray-400">
              Connect with other bikers and join group rides.
            </p>
            <button className="mt-4 text-blue-400 hover:text-blue-300">
              Explore Community →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 