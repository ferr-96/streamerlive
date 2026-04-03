import { useState, useEffect } from 'react';
import { bannersAPI } from '../services/api';
import { 
  Crown, Shield, Gift, Target, Gamepad2, Trophy, 
  Dices, Swords, Play, Users, CheckCircle, 
  Headphones, Lock, Award, ChevronLeft, ChevronRight 
} from 'lucide-react';

function LandingPage() {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannersAPI.getAll(true);
        if (response.data.success) {
          setBanners(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    
    fetchBanners();
  }, []);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const categories = [
    { name: 'Battle Royale', icon: Target, gradient: 'from-purple-500 to-pink-500' },
    { name: 'RPG', icon: Swords, gradient: 'from-pink-500 to-purple-600' },
    { name: 'Sports', icon: Trophy, gradient: 'from-purple-600 to-pink-400' },
    { name: 'Casino', icon: Dices, gradient: 'from-pink-400 to-purple-500' },
    { name: 'Strategy', icon: Gamepad2, gradient: 'from-purple-500 to-pink-600' },
    { name: 'Arcade', icon: Play, gradient: 'from-pink-600 to-purple-400' },
  ];

  const streamers = [
    { 
      name: 'ProGamer_X', 
      viewers: '24.5K', 
      image: 'https://i.pravatar.cc/300?img=12',
      isLive: true 
    },
    { 
      name: 'StreamQueen', 
      viewers: '18.2K', 
      image: 'https://i.pravatar.cc/300?img=45',
      isLive: true 
    },
    { 
      name: 'NinjaKing', 
      viewers: '32.1K', 
      image: 'https://i.pravatar.cc/300?img=33',
      isLive: true 
    },
    { 
      name: 'GamerGirl_Pro', 
      viewers: '15.8K', 
      image: 'https://i.pravatar.cc/300?img=47',
      isLive: true 
    },
  ];

  const features = [
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help anytime, anywhere with our dedicated support team'
    },
    {
      icon: Lock,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Award,
      title: 'Instant Rewards',
      description: 'Earn points and unlock exclusive benefits immediately'
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center glow-purple">
                <Play className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-glow-purple">StreamerLive</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#games" className="text-gray-300 hover:text-neon-purple transition-colors">Games</a>
              <a href="#streamers" className="text-gray-300 hover:text-neon-purple transition-colors">Streamers</a>
              <a href="#vip" className="text-gray-300 hover:text-neon-purple transition-colors">VIP</a>
              <a href="#events" className="text-gray-300 hover:text-neon-purple transition-colors">Events</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 border border-neon-purple text-neon-purple rounded-lg hover:bg-neon-purple/10 transition-all">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg hover:opacity-90 transition-all glow-purple">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding top for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-navy-900 to-pink-900/20"></div>
          
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-glow-purple">
                Join Elite <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">Streamers</span>
              </h1>
              <p className="text-xl text-gray-400">
                A premium gaming livestream platform
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-semibold hover:opacity-90 transition-all glow-purple">
                  CTA Streamers
                </button>
                <button className="px-8 py-4 border-2 border-neon-purple text-neon-purple rounded-lg font-semibold hover:bg-neon-purple/10 transition-all">
                  Sign Up
                </button>
              </div>
            </motion.div>

            {/* Right Content - Cyberpunk Character */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[500px] bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 rounded-3xl glow-purple flex items-center justify-center">
                {/* Placeholder for character illustration */}
                <div className="text-center space-y-4">
                  <Users className="w-32 h-32 mx-auto text-neon-purple opacity-50" />
                  <p className="text-gray-500">Character Illustration</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Icons Row */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-3 group cursor-pointer"
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform glow-purple`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-neon-purple transition-colors">
                    {category.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Rewards Banner */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neon-gold via-neon-purple to-neon-pink p-12 glow-purple">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-12 h-12 text-neon-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold mb-2">VIP Rewards Banner</h3>
                    <p className="text-white/90 text-lg">
                      Get rewards and countless premium gaming livestream platform
                    </p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-neon-gold text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-xl">
                  Get Started
                </button>
              </div>
              
              {/* VIP Badge Graphic */}
              <div className="absolute -right-20 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white/30 rounded-full flex items-center justify-center">
                <Crown className="w-16 h-16 text-neon-gold" />
              </div>
            </div>
          </div>
        </section>

        {/* Streamer Spotlight */}
        <section className="py-16 bg-navy-800/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-glow-purple">
              Streamer Spotlight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {streamers.map((streamer, index) => (
                <motion.div
                  key={streamer.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-navy-800 rounded-xl overflow-hidden border border-gray-800 hover:border-neon-purple transition-all group"
                >
                  {/* Profile Image */}
                  <div className="relative">
                    <img 
                      src={streamer.image} 
                      alt={streamer.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Live Badge */}
                    {streamer.isLive && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span>LIVE</span>
                      </div>
                    )}
                    {/* Viewer Count */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{streamer.viewers}</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{streamer.name}</h3>
                      <p className="text-gray-400 text-sm">Streamer</p>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-semibold hover:opacity-90 transition-all">
                      Follow
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-navy-800/50 border border-gray-800 rounded-xl p-8 hover:border-neon-purple transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center mb-4 glow-purple">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="py-16 bg-navy-800/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="w-full max-w-md mx-auto h-[600px] bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 rounded-[3rem] border-8 border-gray-800 glow-purple flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Gamepad2 className="w-24 h-24 mx-auto text-neon-purple opacity-50" />
                    <p className="text-gray-500">App Screenshot</p>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-glow-purple">
                  Download App<br />Stream Anywhere
                </h2>
                <p className="text-xl text-gray-400">
                  Stream your app to discover premium gaming livestreams
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-black border border-gray-700 rounded-lg hover:border-neon-purple transition-all flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg"></div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Download on the</p>
                      <p className="font-semibold">App Store</p>
                    </div>
                  </button>
                  <button className="px-6 py-3 bg-black border border-gray-700 rounded-lg hover:border-neon-purple transition-all flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg"></div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">GET IT ON</p>
                      <p className="font-semibold">Google Play</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-navy-800 border-t border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Logo & Tagline */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">StreamerLive</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Premium gaming livestream platform for elite streamers
                </p>
              </div>

              {/* Links Column 1 */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-neon-purple transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Streamers</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Features</a></li>
                </ul>
              </div>

              {/* Links Column 2 */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Connect</a></li>
                </ul>
              </div>

              {/* Social & Payment */}
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4 mb-6">
                  <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-neon-purple transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-neon-purple transition-all" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-neon-purple transition-all" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-neon-purple transition-all" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
                <div className="flex space-x-2">
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 StreamerLive. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* API Banner Integration - Floating at bottom right */}
      {banners.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-800 border border-neon-purple rounded-xl overflow-hidden shadow-2xl glow-purple"
          >
            <div className="relative">
              {banners[currentBannerIndex].mediaType === 'video' && banners[currentBannerIndex].videoUrl ? (
                <video
                  src={banners[currentBannerIndex].videoUrl}
                  autoPlay
                  loop
                  muted
                  className="w-full h-48 object-cover"
                />
              ) : banners[currentBannerIndex].mediaType === 'gif' && banners[currentBannerIndex].gifUrl ? (
                <img
                  src={banners[currentBannerIndex].gifUrl}
                  alt={banners[currentBannerIndex].title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src={banners[currentBannerIndex].imageUrl}
                  alt={banners[currentBannerIndex].title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {banners.length > 1 && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={prevBanner}
                    className="p-1 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="p-1 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">{banners[currentBannerIndex].title}</h3>
              {banners[currentBannerIndex].link && (
                <a
                  href={banners[currentBannerIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neon-purple hover:text-neon-pink transition-colors"
                >
                  Learn More →
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
