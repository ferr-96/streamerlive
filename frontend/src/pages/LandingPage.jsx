import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Crown, Target, Swords, Trophy, Dices, Gamepad2,
  Users, Headphones, Lock, Award, Smartphone
} from 'lucide-react';

const STORAGE_KEY = 'streamerlive_editor_data';

// Default fallback data
const defaultData = {
  header: {
    siteName: 'StreamerLive',
    logo: null
  },
  hero: {
    title: 'Join Elite Streamers',
    subtitle: 'A premium gaming livestream platform',
    primaryButtonText: 'CTA Streamers',
    secondaryButtonText: 'Sign Up'
  },
  vipBanner: {
    title: 'VIP Rewards Banner',
    description: 'Get rewards and countless premium gaming livestream platform',
    buttonText: 'Get Started'
  },
  downloadSection: {
    title: 'Download App Stream Anywhere',
    description: 'Stream your app to discover premium gaming livestreams',
    appStoreLink: '#',
    playStoreLink: '#'
  },
  categories: [
    { name: 'Battle Royale', icon: 'Target', gradient: 'from-purple-500 to-pink-500' },
    { name: 'RPG', icon: 'Swords', gradient: 'from-pink-500 to-purple-600' },
    { name: 'Sports', icon: 'Trophy', gradient: 'from-purple-600 to-pink-400' },
    { name: 'Casino', icon: 'Dices', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Strategy', icon: 'Gamepad2', gradient: 'from-purple-500 to-pink-600' },
    { name: 'Arcade', icon: 'Play', gradient: 'from-pink-600 to-purple-400' },
  ],
  streamers: [
    { name: 'Atherton', viewers: '24.5K', image: 'https://i.pravatar.cc/300?img=12', profileUrl: '' },
    { name: 'Nana', viewers: '18.2K', image: 'https://i.pravatar.cc/300?img=45', profileUrl: '' },
    { name: 'Geertan', viewers: '32.1K', image: 'https://i.pravatar.cc/300?img=33', profileUrl: '' },
    { name: 'Monika', viewers: '15.8K', image: 'https://i.pravatar.cc/300?img=47', profileUrl: '' },
  ],
  features: [
    {
      icon: 'Headphones',
      iconImage: '',
      title: '24/7 Support',
      description: 'Get help anytime, anywhere with our dedicated support team ready to assist you.',
      link: ''
    },
    {
      icon: 'Lock',
      iconImage: '',
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and encryption protocols.',
      link: ''
    },
    {
      icon: 'Award',
      iconImage: '',
      title: 'Instant Rewards',
      description: 'Earn points and unlock exclusive benefits immediately as you stream and engage.',
      link: ''
    },
  ]
};

function LandingPage() {
  const [pageData, setPageData] = useState(defaultData);

  // Load data from localStorage on mount AND listen for changes
  useEffect(() => {
    const loadData = () => {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setPageData(prev => ({
            ...prev,
            ...data,
            categories: data.categories || defaultData.categories,
            streamers: data.streamers || defaultData.streamers,
            features: data.features || defaultData.features
          }));
          console.log('📄 LandingPage loaded data from localStorage');
        } catch (error) {
          console.error('Failed to parse cached data:', error);
        }
      }
    };

    // Load initially
    loadData();

    // Listen for storage changes (from other tabs or visual editor)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        console.log('🔄 Storage changed, reloading data...');
        loadData();
      }
    };

    // Listen for custom event from visual editor (same tab)
    const handleDataUpdate = () => {
      console.log('🔄 Data update event received');
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('streamerlive-data-updated', handleDataUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('streamerlive-data-updated', handleDataUpdate);
    };
  }, []);

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      Target, Swords, Trophy, Dices, Gamepad2, Play,
      Headphones, Lock, Award, Users, Crown, Smartphone
    };
    return icons[iconName] || Target;
  };

  const { categories, streamers, features, header, hero, vipBanner, downloadSection } = pageData;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                {header?.siteName || 'StreamerLive'}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#games" className="text-gray-300 hover:text-[#a855f7] transition-colors">Games</a>
              <a href="#streamers" className="text-gray-300 hover:text-[#a855f7] transition-colors">Streamers</a>
              <a href="#vip" className="text-gray-300 hover:text-[#a855f7] transition-colors">VIP</a>
              <a href="#events" className="text-gray-300 hover:text-[#a855f7] transition-colors">Events</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full hover:opacity-90 transition-all font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-[#0a0a1a] to-pink-900/10"></div>
          
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                {hero?.title || 'Join Elite Streamers'}
              </h1>
              <p className="text-xl text-gray-400">
                {hero?.subtitle || 'A premium gaming livestream platform'}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  {hero?.primaryButtonText || 'CTA Streamers'}
                </button>
                <button className="px-8 py-4 border-2 border-[#a855f7] text-[#a855f7] rounded-lg font-semibold hover:bg-[#a855f7]/10 transition-all">
                  {hero?.secondaryButtonText || 'Sign Up'}
                </button>
              </div>
            </motion.div>

            {/* Right Content - Cyberpunk Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[500px] bg-gradient-to-br from-[#a855f7]/20 via-[#ec4899]/20 to-purple-900/20 rounded-3xl border border-[#a855f7]/30 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-10 right-10 w-40 h-40 bg-[#a855f7]/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#ec4899]/30 rounded-full blur-3xl animate-pulse delay-300"></div>
                <Users className="w-32 h-32 text-[#a855f7]/40" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Icons Row */}
        <section className="py-20 bg-[#0f0f23]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => {
                const IconComponent = getIcon(category.icon);
                return (
                  <motion.div
                    key={category.id || category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-[#0a0a1a] border border-gray-800 rounded-xl p-6 hover:border-[#a855f7] transition-all cursor-pointer group"
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden`}>
                      {category.iconImage ? (
                        <img src={category.iconImage} className="w-full h-full object-cover" alt={category.name} />
                      ) : (
                        <IconComponent className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <p className="text-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {category.name}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VIP Rewards Banner */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fbbf24] via-[#a855f7] to-[#ec4899] p-1">
              <div className="bg-[#0a0a1a] rounded-[22px] p-12">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#fbbf24] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-3xl font-bold mb-3">{vipBanner?.title || 'VIP Rewards Banner'}</h3>
                      <p className="text-gray-300 text-lg mb-6">
                        {vipBanner?.description || 'Get rewards and countless premium gaming livestream platform'}
                      </p>
                      <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-[#fbbf24] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                        {vipBanner?.buttonText || 'Get Started'}
                      </button>
                    </div>
                  </div>
                  
                  {/* VIP Badge Graphic */}
                  <div className="relative w-32 h-32 border-4 border-[#fbbf24]/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/20 to-[#a855f7]/20 rounded-full animate-pulse"></div>
                    <Crown className="w-16 h-16 text-[#fbbf24] relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Streamer Spotlight */}
        <section className="py-20 bg-[#0f0f23]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-bold mb-16 text-center"
            >
              Streamer Spotlight
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {streamers.map((streamer, index) => {
                const cardContent = (
                  <motion.div
                    key={streamer.id || streamer.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-[#0a0a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-[#a855f7] transition-all group"
                  >
                    {/* Profile Image */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={streamer.image} 
                        alt={streamer.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Live Badge */}
                      {streamer.isLive !== false && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center space-x-1.5">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          <span>LIVE</span>
                        </div>
                      )}
                      {/* Viewer Count */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-sm rounded-full flex items-center space-x-1.5">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{streamer.viewers}</span>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{streamer.name}</h3>
                        <p className="text-gray-400 text-sm">Streamer</p>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                        Follow
                      </button>
                    </div>
                  </motion.div>
                );

                return streamer.profileUrl ? (
                  <a key={streamer.id || streamer.name} href={streamer.profileUrl} target="_blank" rel="noopener noreferrer">
                    {cardContent}
                  </a>
                ) : (
                  cardContent
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = getIcon(feature.icon);
                const content = (
                  <motion.div
                    key={feature.id || feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-[#0f0f23] border border-gray-800 rounded-xl p-8 hover:border-[#a855f7] transition-all ${feature.link ? 'cursor-pointer' : ''}`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-xl flex items-center justify-center mb-6">
                      {feature.iconImage ? (
                        <img src={feature.iconImage} alt={feature.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <IconComponent className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
                
                return feature.link ? (
                  <a key={feature.id || feature.title} href={feature.link} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={feature.id || feature.title}>{content}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="py-20 bg-[#0f0f23]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="w-full max-w-sm mx-auto h-[600px] bg-gradient-to-br from-[#a855f7]/30 via-[#ec4899]/30 to-purple-900/20 rounded-[3rem] border-8 border-gray-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-20 right-10 w-32 h-32 bg-[#a855f7]/40 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#ec4899]/40 rounded-full blur-2xl animate-pulse delay-500"></div>
                  {downloadSection?.phoneMockup ? (
                    <img 
                      src={downloadSection.phoneMockup} 
                      alt="Phone mockup" 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <Smartphone className="w-24 h-24 text-[#a855f7]/50" />
                  )}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                  {downloadSection?.title || 'Download App Stream Anywhere'}
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  {downloadSection?.description || 'Stream your app to discover premium gaming livestreams'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Download on the</p>
                      <p className="font-semibold text-white">App Store</p>
                    </div>
                  </button>
                  <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">GET IT ON</p>
                      <p className="font-semibold text-white">Google Play</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0a1a] border-t border-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Logo & Tagline */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                  <span className="text-xl font-bold">StreamerLive</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Premium gaming livestream platform for elite streamers worldwide
                </p>
              </div>

              {/* Links Column 1 */}
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#about" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">About</a></li>
                  <li><a href="#streamers" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Streamers</a></li>
                  <li><a href="#home" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Home</a></li>
                  <li><a href="#features" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Features</a></li>
                </ul>
              </div>

              {/* Links Column 2 */}
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#contact" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Contact Us</a></li>
                  <li><a href="#blog" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Blog</a></li>
                  <li><a href="#connect" className="text-gray-400 hover:text-[#a855f7] transition-colors text-sm">Connect</a></li>
                </ul>
              </div>

              {/* Social & Trust Badges */}
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-3 mb-6">
                  {/* Facebook */}
                  <a href="#facebook" className="w-10 h-10 bg-gray-800 hover:bg-[#a855f7] rounded-full flex items-center justify-center transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                  {/* Twitter */}
                  <a href="#twitter" className="w-10 h-10 bg-gray-800 hover:bg-[#a855f7] rounded-full flex items-center justify-center transition-all" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="#youtube" className="w-10 h-10 bg-gray-800 hover:bg-[#a855f7] rounded-full flex items-center justify-center transition-all" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#instagram" className="w-10 h-10 bg-gray-800 hover:bg-[#a855f7] rounded-full flex items-center justify-center transition-all" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
                {/* Trust Badges */}
                <div className="flex space-x-2">
                  <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 flex items-center space-x-1.5">
                    <Award className="w-3 h-3 text-blue-500" />
                    <span>Trusted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 StreamerLive. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
