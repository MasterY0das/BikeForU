import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-gray-900 p-8 rounded-lg">
          <p className="text-gray-300 mb-6">
            This Terms of Service page is currently under development. We are working on creating comprehensive terms that will comply with iOS App Store requirements and protect both our users and our platform.
          </p>
          
          <p className="text-gray-300 mb-6">
            Our terms of service will cover:
          </p>
          
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• User responsibilities and conduct</li>
            <li>• Platform usage guidelines</li>
            <li>• Intellectual property rights</li>
            <li>• Limitation of liability</li>
            <li>• Dispute resolution</li>
            <li>• Termination policies</li>
            <li>• Updates and modifications</li>
          </ul>
          
          <p className="text-gray-300">
            This page will be updated with the complete terms of service before our iOS app launch. Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 