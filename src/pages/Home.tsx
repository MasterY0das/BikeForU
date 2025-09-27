import React from 'react';

const Home: React.FC = () => {
  const handleContact = () => {
    // Open Gmail compose with pre-filled recipient
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nikhil9kalburgi@gmail.com&su=Contact from BikeForU&body=Hello,%0D%0A%0D%0AI would like to get in touch regarding BikeForU.%0D%0A%0D%0AThank you!`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-screen background-natural" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-color)' }}>
              <span className="text-white font-bold text-xl">🚴</span>
            </div>
            <h1 style={{ 
              color: 'var(--text-color)', 
              fontSize: '32px', 
              fontWeight: '700',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>BikeForU</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 badge-trail px-4 py-2 rounded-full">
                <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Manrope, sans-serif' }}>🌲 Adventure Awaits</span>
              </div>
              <h2 style={{ 
                color: 'var(--text-color)', 
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                fontWeight: '700',
                lineHeight: '1.1',
                fontFamily: 'Poppins, sans-serif'
              }}>
                Connect with Fellow 
                <span className="text-gradient block">Nature Lovers</span>
              </h2>
              <p style={{ 
                color: 'var(--secondary-text-color)', 
                fontSize: '20px',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Join a community of peaceful explorers who believe the best adventures happen when we connect with kindred spirits and explore nature at our own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleContact}
                  className="button-primary inline-flex items-center space-x-2"
                  type="button"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  <span>✉️</span>
                  <span>Get In Touch</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="card-trail p-8 transform rotate-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-trail flex items-center justify-center">
                      <span className="text-white text-sm">🏔️</span>
                    </div>
                    <span style={{ 
                      color: 'var(--text-color)', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>Mountain Trails</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-sky flex items-center justify-center">
                      <span className="text-white text-sm">🌊</span>
                    </div>
                    <span style={{ 
                      color: 'var(--text-color)', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>Scenic Routes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center">
                      <span className="text-white text-sm">🌿</span>
                    </div>
                    <span style={{ 
                      color: 'var(--text-color)', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>Forest Paths</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--secondary-background)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 style={{ 
              color: 'var(--text-color)', 
              fontSize: '24px', 
              fontWeight: '700',
              marginBottom: '16px',
              fontFamily: 'Poppins, sans-serif'
            }}>Why Choose BikeForU?</h3>
            <p style={{ 
              color: 'var(--secondary-text-color)', 
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif'
            }}>
              We're more than just a biking community - we're your gateway to meaningful outdoor connections
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-natural text-center space-y-4 interactive">
              <div className="w-16 h-16 rounded-full bg-trail mx-auto flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 style={{ 
                color: 'var(--text-color)', 
                fontSize: '18px', 
                fontWeight: '600',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>Meaningful Connections</h4>
              <p style={{ 
                color: 'var(--secondary-text-color)',
                fontFamily: 'Inter, sans-serif'
              }}>
                Connect with like-minded nature lovers who share your passion for peaceful exploration and outdoor adventures.
              </p>
            </div>
            
            <div className="card-natural text-center space-y-4 interactive">
              <div className="w-16 h-16 rounded-full bg-sky mx-auto flex items-center justify-center">
                <span className="text-2xl">🚴‍♀️</span>
              </div>
              <h4 style={{ 
                color: 'var(--text-color)', 
                fontSize: '18px', 
                fontWeight: '600',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>Your Own Pace</h4>
              <p style={{ 
                color: 'var(--secondary-text-color)',
                fontFamily: 'Inter, sans-serif'
              }}>
                No pressure, no competition. Explore beautiful trails and scenic routes at a pace that feels right for you.
              </p>
            </div>
            
            <div className="card-natural text-center space-y-4 interactive">
              <div className="w-16 h-16 rounded-full bg-earth mx-auto flex items-center justify-center">
                <span className="text-2xl">🌲</span>
              </div>
              <h4 style={{ 
                color: 'var(--text-color)', 
                fontSize: '18px', 
                fontWeight: '600',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>Nature First</h4>
              <p style={{ 
                color: 'var(--secondary-text-color)',
                fontFamily: 'Inter, sans-serif'
              }}>
                Every journey is an opportunity to slow down, breathe deeply, and appreciate the simple pleasures of being outdoors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-trail p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 style={{ 
                color: 'var(--text-color)', 
                fontSize: '24px', 
                fontWeight: '700',
                marginBottom: '16px',
                fontFamily: 'Poppins, sans-serif'
              }}>Our Story</h3>
              <div className="w-20 h-1 bg-trail mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-6" style={{ 
              color: 'var(--text-color)', 
              fontSize: '18px',
              lineHeight: '1.7',
              fontFamily: 'Inter, sans-serif'
            }}>
              <p>
                BikeForU was born from a simple belief: that the best adventures happen when we connect with kindred spirits who share our love for nature and peaceful exploration.
              </p>
              <p>
                We're not about pushing limits or conquering trails. Instead, we focus on creating meaningful connections between nature lovers who want to explore the world at their own pace, whether that's a gentle bike ride through scenic countryside or a peaceful hike along mountain paths.
              </p>
              <p>
                Our community is built on warmth, respect, and the shared joy of discovering beautiful places together. Every journey is an opportunity to slow down, breathe deeply, and appreciate the simple pleasures of being outdoors with good company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h3 style={{ 
              color: 'var(--text-color)', 
              fontSize: '24px', 
              fontWeight: '700',
              fontFamily: 'Poppins, sans-serif'
            }}>Get In Touch</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleContact}
                className="button-primary inline-flex items-center space-x-3 text-lg px-8 py-4"
                type="button"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <span>📧</span>
                <span>Contact Us</span>
              </button>
              <div style={{ 
                color: 'var(--secondary-text-color)', 
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                <span>or email directly: </span>
                <button 
                  onClick={handleContact}
                  className="font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
                  style={{ 
                    color: 'var(--accent-color)',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                  type="button"
                >
                  nikhil9kalburgi@gmail.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;