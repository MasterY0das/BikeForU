import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="bg-gray-900 p-8 rounded-lg">
          <p className="text-gray-300 mb-6">
            This Cookie Policy page is currently under development. We are working on creating a comprehensive cookie policy that will comply with iOS App Store requirements and inform users about our data collection practices.
          </p>
          
          <p className="text-gray-300 mb-6">
            Our cookie policy will cover:
          </p>
          
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• Types of cookies we use</li>
            <li>• Purpose of each cookie</li>
            <li>• Cookie duration and expiration</li>
            <li>• Third-party cookies</li>
            <li>• User consent and preferences</li>
            <li>• How to manage cookies</li>
            <li>• Updates to this policy</li>
          </ul>
          
          <p className="text-gray-300">
            This page will be updated with the complete cookie policy before our iOS app launch. Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 