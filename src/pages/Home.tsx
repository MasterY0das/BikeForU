import React, { useEffect, useState, useRef } from 'react';
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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            overflow-x: hidden;
          }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          html {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
        `
      }} />
      
      {/* Animation Container - Only show when animation is not complete */}
      {!animationComplete && (
        <>
          {/* Spacer divs to enable scrolling */}
          <div className="relative">
            {scenes.map((_, index) => (
              <div key={index} className="h-screen" />
            ))}
          </div>

          {/* Fixed scene container */}
          <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-green-900 via-green-800 to-green-900">
            {/* Background video for biking scene */}
            {currentScene === 0 && (
              <div className="absolute inset-0 opacity-20">
                <video autoPlay muted loop className="w-full h-full object-cover">
                  <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
              </div>
            )}

            {/* Background video for running scene */}
            {currentScene === 1 && (
              <div className="absolute inset-0 opacity-20">
                <video autoPlay muted loop className="w-full h-full object-cover">
                  <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
              </div>
            )}

            {/* Background video for community scene */}
            {currentScene === 2 && (
              <div className="absolute inset-0 opacity-20">
                <video autoPlay muted loop className="w-full h-full object-cover">
                  <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
              </div>
            )}

            {/* Background video for success scene */}
            {currentScene === 3 && (
              <div className="absolute inset-0 opacity-20">
                <video autoPlay muted loop className="w-full h-full object-cover">
                  <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
              </div>
            )}

            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-32 h-32 bg-green-600/10 blur-xl animate-pulse"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-green-500/10 blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-green-400/10 blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-20 right-20 w-20 h-20 bg-green-300/10 blur-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            {/* Scene layers */}
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1500 ease-out ${
                  currentScene === index 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-0 transform translate-y-12 scale-95'
                }`}
              >
                <div className="text-center text-white">
                  <div className={`mb-8 transition-all duration-1000 ease-out ${
                    currentScene === index 
                      ? 'animate-pulse scale-110' 
                      : 'scale-100'
                  }`}>
                    {scene.icon}
                  </div>
                  <h1 className={`text-6xl font-bold mb-4 transition-all duration-1000 ease-out ${
                    currentScene === index 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-8 opacity-0'
                  }`}>
                    {scene.subtitle}
                  </h1>
                  <p className={`text-2xl text-green-200 transition-all duration-1000 ease-out delay-300 ${
                    currentScene === index 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-8 opacity-0'
                  }`}>
                    {scene.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Enhanced scroll indicator */}
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center transition-all duration-500 ${
              currentScene >= 3 ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="text-sm mb-2 animate-pulse">Scroll to explore</div>
              <div className="w-6 h-10 border-2 border-white mx-auto relative">
                <div className="w-1 h-3 bg-white mx-auto mt-2 animate-bounce"></div>
              </div>
            </div>

            {/* Enhanced progress indicator */}
            <div className={`absolute top-8 right-8 flex space-x-2 transition-all duration-500 ${
              currentScene >= 3 ? 'opacity-0' : 'opacity-100'
            }`}>
              {scenes.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 transition-all duration-500 ease-out ${
                    currentScene === index 
                      ? 'bg-white scale-125' 
                      : currentScene > index 
                        ? 'bg-green-400 scale-100' 
                        : 'bg-white/30 scale-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main content - Always visible but only interactive after animation */}
      <div className={`transition-all duration-1500 ease-out ${animationComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-gray-900 font-bold text-xl">BikeForU</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                  <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                </nav>
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Connect with Fellow
                <span className="text-green-600"> Adventure Seekers</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join a community of cyclists, runners, and outdoor enthusiasts. 
                Find your perfect riding partner or running buddy and CRUSH your goals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transition-colors transform hover:scale-105"
                >
                  Start Your Adventure
                </Link>
                <Link
                  to="/login"
                  className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold transition-colors transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
                Why Choose BikeForU?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Squad</h3>
                  <p className="text-gray-600">
                    Connect with people who share your passion and energy level
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Epic Routes</h3>
                  <p className="text-gray-600">
                    Find and share amazing trails with your adventure crew
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Progress</h3>
                  <p className="text-gray-600">
                    Monitor your fitness journey and celebrate every win
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Image Gallery Section */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
                Real Adventures, Real People
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Mountain biking adventure"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mountain Trails</h3>
                    <p className="text-gray-600">Conquer challenging mountain trails with your adventure squad</p>
                  </div>
                </div>
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Road cycling"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Road Adventures</h3>
                    <p className="text-gray-600">Explore scenic routes and push your limits on the open road</p>
                  </div>
                </div>
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Running in nature"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Trail Running</h3>
                    <p className="text-gray-600">Discover hidden trails and connect with nature on foot</p>
                  </div>
                </div>
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Group cycling"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Group Rides</h3>
                    <p className="text-gray-600">Join group rides and build lasting friendships</p>
                  </div>
                </div>
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Sunset cycling"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sunset Rides</h3>
                    <p className="text-gray-600">Experience magical moments on evening adventures</p>
                  </div>
                </div>
                <div className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Adventure planning"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Adventures</h3>
                    <p className="text-gray-600">Plan epic adventures and share routes with your community</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Start Your EPIC Adventure?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of outdoor enthusiasts who have found their perfect match
              </p>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transition-colors inline-block transform hover:scale-105"
              >
                Create Your Profile
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <span className="text-white font-bold text-xl">BikeForU</span>
                  </div>
                  <p className="text-gray-300">
                    Connecting outdoor enthusiasts through shared adventures.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="/cookies" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-gray-300">
                  © 2024 BikeForU. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home; 