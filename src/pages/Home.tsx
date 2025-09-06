import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset animation state when component mounts (page loads)
  useEffect(() => {
    setScrollY(0);
    setCurrentScene(0);
    setAnimationComplete(false);
    
    // Scroll to top to ensure animation starts from beginning
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      
      // Only track scenes if animation is not complete
      if (!animationComplete) {
        const sceneHeight = window.innerHeight;
        const newScene = Math.floor(scrollPosition / sceneHeight);
        const finalScene = Math.min(newScene, 3);
        setCurrentScene(finalScene);
        
        // Mark animation as complete when we reach the last scene
        if (finalScene >= 3) {
          setAnimationComplete(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationComplete]);

  const scenes = [
    {
      id: 0,
      icon: (
        <div className="flex items-center justify-center w-40 h-40 bg-green-600/20 border-2 border-green-400/30 backdrop-blur-sm">
          <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
      ),
      subtitle: "Ready to CRUSH it?",
      description: "Let's get this adventure started!"
    },
    {
      id: 1,
      icon: (
        <div className="flex items-center justify-center w-40 h-40 bg-green-600/20 border-2 border-green-400/30 backdrop-blur-sm">
          <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      subtitle: "Or RUN WILD?",
      description: "Break free and explore!"
    },
    {
      id: 2,
      icon: (
        <div className="flex items-center justify-center w-40 h-40 bg-green-600/20 border-2 border-green-400/30 backdrop-blur-sm">
          <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      ),
      subtitle: "Your EPIC Mission",
      description: "Connect with fellow adventure seekers!"
    },
    {
      id: 3,
      icon: (
        <div className="flex items-center justify-center w-40 h-40 bg-green-600/20 border-2 border-green-400/30 backdrop-blur-sm">
          <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      subtitle: "Let's DO THIS!",
      description: "Your journey starts NOW!"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-50"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            BikeForU
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow bikers. Share your adventures. Build your community.
          </p>
          <div className="space-x-4">
            <Link 
              to="/signup" 
              className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose BikeForU?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl mb-4">🚴</div>
              <h3 className="text-2xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-400">
                Find and connect with bikers in your area. Share routes and plan rides together.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-semibold mb-4">Share</h3>
              <p className="text-gray-400">
                Share your biking adventures, photos, and experiences with the community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-semibold mb-4">Achieve</h3>
              <p className="text-gray-400">
                Track your progress, earn badges, and celebrate your biking milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of bikers who are already part of our community.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 