import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-bike-background dark:bg-bike-dark-background text-bike-text-primary dark:text-bike-dark-text-primary transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-bike-primary dark:text-bike-dark-primary">
            BikeForU
          </h1>
          <p className="text-xl md:text-2xl text-bike-text-secondary dark:text-bike-dark-text-secondary mb-4 max-w-4xl mx-auto">
            Adventure GPS Tracking & Community App
          </p>
          <p className="text-lg md:text-xl text-bike-text-secondary dark:text-bike-dark-text-secondary mb-12 max-w-5xl mx-auto leading-relaxed">
            BikeForU is a comprehensive outdoor adventure companion app designed for cyclists, hikers, and outdoor enthusiasts who want to track their adventures, discover new trails, and connect with a community of like-minded adventurers.
          </p>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-16 px-4 bg-bike-secondary-bg dark:bg-bike-dark-secondary-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-bike-primary dark:text-bike-dark-primary">
            🚴‍♂️ Core Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-bike-trail dark:text-bike-dark-trail">GPS Tracking & Route Management</h3>
              <ul className="text-bike-text-secondary dark:text-bike-dark-text-secondary space-y-2">
                <li>• Real-time GPS tracking for biking, hiking, and outdoor activities</li>
                <li>• Route recording with detailed metrics (distance, elevation, duration)</li>
                <li>• Offline map support for remote adventures</li>
                <li>• Custom route creation and sharing</li>
                <li>• Distance unit preferences (kilometers/miles)</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-bike-sky dark:text-bike-dark-sky">Trail Discovery & News</h3>
              <ul className="text-bike-text-secondary dark:text-bike-dark-text-secondary space-y-2">
                <li>• Curated outdoor adventure news feed</li>
                <li>• Trail recommendations and community insights</li>
                <li>• Adventure-related articles and tips</li>
                <li>• Offline content storage for remote areas</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-bike-sunset dark:text-bike-dark-sunset">Social Community</h3>
              <ul className="text-bike-text-secondary dark:text-bike-dark-text-secondary space-y-2">
                <li>• Connect with fellow outdoor enthusiasts</li>
                <li>• Share routes and achievements</li>
                <li>• Community challenges and events</li>
                <li>• Friend connections and activity sharing</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-bike-moss dark:text-bike-dark-moss">Personalized Experience</h3>
              <ul className="text-bike-text-secondary dark:text-bike-dark-text-secondary space-y-2">
                <li>• User profiles with activity history</li>
                <li>• Interest-based content recommendations</li>
                <li>• Customizable themes (light/dark mode)</li>
                <li>• Personalized adventure preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-bike-primary dark:text-bike-dark-primary">
            🎯 Target Audience
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚴‍♂️</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Cyclists</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Road cyclists, mountain bikers, casual riders
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sky dark:text-bike-dark-sky">Hikers & Trekkers</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Trail enthusiasts, nature lovers
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🏔️</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sunset dark:text-bike-dark-sunset">Outdoor Adventurers</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Anyone seeking outdoor exploration
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-moss dark:text-bike-dark-moss">Fitness Enthusiasts</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                People tracking outdoor workouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Philosophy Section */}
      <div className="py-16 px-4 bg-bike-secondary-bg dark:bg-bike-dark-secondary-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-bike-primary dark:text-bike-dark-primary">
            🌿 Design Philosophy
          </h2>
          
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-lg text-bike-text-secondary dark:text-bike-dark-text-secondary mb-6 leading-relaxed">
              Built with a nature-inspired design system featuring:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Earthy Color Palette</h3>
                <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                  Forest greens, warm browns, sky blues
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-3">🏕️</div>
                <h3 className="text-lg font-semibold mb-2 text-bike-sky dark:text-bike-dark-sky">Adventure Theme</h3>
                <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                  Outdoor-focused visual elements
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-semibold mb-2 text-bike-sunset dark:text-bike-dark-sunset">Intuitive Interface</h3>
                <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                  Responsive design for all weather conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-bike-primary dark:text-bike-dark-primary">
            💡 Key Benefits
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Stay Connected</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Never lose your way with reliable GPS tracking
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sky dark:text-bike-dark-sky">Discover More</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Find new trails and outdoor destinations
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sunset dark:text-bike-dark-sunset">Track Progress</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Monitor fitness goals and adventure milestones
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-moss dark:text-bike-dark-moss">Build Community</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Connect with fellow outdoor enthusiasts
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">📶</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Go Offline</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Access maps and content without internet connection
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sky dark:text-bike-dark-sky">Personal Growth</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Challenge yourself with new routes and activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Features Section */}
      <div className="py-16 px-4 bg-bike-secondary-bg dark:bg-bike-dark-secondary-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-bike-primary dark:text-bike-dark-primary">
            ⚙️ Technical Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Cross-platform</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Works on all devices and platforms
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sky dark:text-bike-dark-sky">Offline-first</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Architecture designed for remote adventures
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-sunset dark:text-bike-dark-sunset">Real-time Sync</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Instant updates across all devices
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-moss dark:text-bike-dark-moss">Privacy-focused</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                Your data stays secure and private
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🔋</div>
              <h3 className="text-lg font-semibold mb-2 text-bike-trail dark:text-bike-dark-trail">Battery Optimized</h3>
              <p className="text-bike-text-secondary dark:text-bike-dark-text-secondary text-sm">
                GPS tracking that preserves battery life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Description Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-bike-text-secondary dark:text-bike-dark-text-secondary leading-relaxed">
            <strong>BikeForU</strong> transforms every outdoor adventure into a connected, trackable, and social experience, making it easier than ever to explore the world around you while building meaningful connections with the outdoor community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 