import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-gray-900 p-8 rounded-lg">
          <p className="text-gray-300 mb-6">
            This Privacy Policy page is currently under development. We are working on creating a comprehensive privacy policy that will comply with iOS App Store requirements and protect our users' data.
          </p>
          
          <p className="text-gray-300 mb-6">
            Our privacy policy will cover:
          </p>
          
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• Data collection and usage</li>
            <li>• User consent and permissions</li>
            <li>• Data storage and security</li>
            <li>• Third-party services</li>
            <li>• User rights and data deletion</li>
            <li>• Contact information</li>
          </ul>
          
          <p className="text-gray-300">
            This page will be updated with the complete privacy policy before our iOS app launch. Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 