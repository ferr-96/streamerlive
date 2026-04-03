import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Eye, Undo, Redo, Plus, AlertCircle, WifiOff, Check,
  Play, Crown, Target, Swords, Trophy, Dices, Gamepad2,
  Users, Headphones, Lock, Award, Smartphone
} from 'lucide-react';
import EditableElement from '../../components/admin/EditableElement';
import PropertiesPanel from '../../components/admin/PropertiesPanel';
import api from '../../services/api';

const STORAGE_KEY = 'streamerlive_editor_data';
const API_BASE = import.meta.env.VITE_API_URL || 'http://139.59.242.118:3001/api';

/**
 * VisualEditor - WYSIWYG page builder for StreamerLive
 */
function VisualEditor() {
  // Editor State
  const [selectedElement, setSelectedElement] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Page Content State with fallback data
  const [pageData, setPageData] = useState({
    header: {
      siteName: 'StreamerLive',
      logo: null
    },
    hero: {
      title: 'Join Elite Streamers',
      subtitle: 'A premium gaming livestream platform',
      primaryButtonText: 'CTA Streamers',
      primaryButtonLink: '#',
      secondaryButtonText: 'Sign Up',
      secondaryButtonLink: '#',
      characterImage: null
    },
    categories: [
      { id: 'cat1', name: 'Battle Royale', icon: 'Target', gradient: 'from-purple-500 to-pink-500' },
      { id: 'cat2', name: 'RPG', icon: 'Swords', gradient: 'from-pink-500 to-purple-600' },
      { id: 'cat3', name: 'Sports', icon: 'Trophy', gradient: 'from-purple-600 to-pink-400' },
      { id: 'cat4', name: 'Casino', icon: 'Dices', gradient: 'from-pink-400 to-purple-500' },
      { id: 'cat5', name: 'Strategy', icon: 'Gamepad2', gradient: 'from-purple-500 to-pink-600' },
      { id: 'cat6', name: 'Arcade', icon: 'Play', gradient: 'from-pink-600 to-purple-400' },
    ],
    vipBanner: {
      title: 'VIP Rewards Banner',
      description: 'Get rewards and countless premium gaming livestream platform',
      buttonText: 'Get Started',
      buttonLink: '#',
      backgroundImage: null
    },
    streamers: [
      { id: 'str1', name: 'Atherton', viewers: '24.5K', image: 'https://i.pravatar.cc/300?img=12', isLive: true, profileUrl: '' },
      { id: 'str2', name: 'Nana', viewers: '18.2K', image: 'https://i.pravatar.cc/300?img=45', isLive: true, profileUrl: '' },
      { id: 'str3', name: 'Geertan', viewers: '32.1K', image: 'https://i.pravatar.cc/300?img=33', isLive: true, profileUrl: '' },
      { id: 'str4', name: 'Monika', viewers: '15.8K', image: 'https://i.pravatar.cc/300?img=47', isLive: true, profileUrl: '' },
    ],
    features: [
      { id: 'feat1', icon: 'Headphones', title: '24/7 Support', description: 'Get help anytime, anywhere with our dedicated support team ready to assist you.' },
      { id: 'feat2', icon: 'Lock', title: 'Secure Platform', description: 'Your data is protected with enterprise-grade security and encryption protocols.' },
      { id: 'feat3', icon: 'Award', title: 'Instant Rewards', description: 'Earn points and unlock exclusive benefits immediately as you stream and engage.' },
    ],
    downloadSection: {
      heading: 'Download App',
      subheading: 'Stream Anywhere',
      description: 'Stream your app to discover premium gaming livestreams',
      appStoreLink: '#',
      playStoreLink: '#',
      phoneMockup: null
    },
    footerLinks: [
      { id: 'link1', text: 'About', url: '#about' },
      { id: 'link2', text: 'Streamers', url: '#streamers' },
      { id: 'link3', text: 'Contact Us', url: '#contact' },
    ],
    socialLinks: [
      { id: 'social1', platform: 'Facebook', url: '#facebook' },
      { id: 'social2', platform: 'Twitter', url: '#twitter' },
      { id: 'social3', platform: 'YouTube', url: '#youtube' },
      { id: 'social4', platform: 'Instagram', url: '#instagram' },
    ]
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    console.log('💾 Auto-saving to localStorage:', pageData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
    console.log('✅ localStorage.setItem called with key:', STORAGE_KEY);
  }, [pageData]);

  const loadData = async () => {
    try {
      // Try loading from localStorage first
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setPageData(JSON.parse(cached));
      }

      // Then try API
      const [settingsRes, bannersRes] = await Promise.all([
        fetch(`${API_BASE}/settings`).catch(() => null),
        fetch(`${API_BASE}/banners`).catch(() => null)
      ]);

      if (settingsRes?.ok || bannersRes?.ok) {
        setIsOnline(true);
        // Merge API data with current state
        // For now, we'll just mark as online
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setIsOnline(false);
    }
  };

  const saveData = async () => {
    setIsSaving(true);
    setSaveStatus('');

    try {
      // Always save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));

      // Try saving to API
      if (isOnline) {
        // In production, send to respective endpoints
        // For now, just simulate
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleElementClick = (id, type) => {
    let data = null;

    // Find the element data based on type
    if (type === 'header') {
      data = pageData.header;
    } else if (type === 'hero') {
      data = pageData.hero;
    } else if (type === 'vip-banner') {
      data = pageData.vipBanner;
    } else if (type === 'download-section') {
      data = pageData.downloadSection;
    } else if (type.startsWith('category')) {
      data = pageData.categories.find(c => c.id === id);
    } else if (type.startsWith('streamer')) {
      data = pageData.streamers.find(s => s.id === id);
    } else if (type.startsWith('feature')) {
      data = pageData.features.find(f => f.id === id);
    }

    setSelectedElement({ id, type, data });
  };

  const handleUpdate = (id, newData, elementType = null) => {
    // Use passed elementType or fall back to selectedElement
    const type = elementType || selectedElement?.type;
    console.log('🔍 VisualEditor handleUpdate called:', { id, newData, type });
    
    if (!type) {
      console.error('❌ No element type provided to handleUpdate');
      return;
    }
    
    setPageData(prev => {
      const updated = { ...prev };

      if (type === 'header') {
        console.log('✅ Updating header');
        updated.header = newData;
      } else if (type === 'hero') {
        console.log('✅ Updating hero');
        updated.hero = newData;
      } else if (type === 'vip-banner') {
        console.log('✅ Updating vip-banner');
        updated.vipBanner = newData;
      } else if (type === 'download-section') {
        console.log('✅ Updating download-section');
        updated.downloadSection = newData;
      } else if (type.startsWith('category') || type === 'category') {
        console.log('✅ Updating category:', id);
        updated.categories = prev.categories.map(c => c.id === id ? { ...c, ...newData } : c);
      } else if (type.startsWith('streamer') || type === 'streamer-card') {
        console.log('✅ Updating streamer:', id);
        updated.streamers = prev.streamers.map(s => s.id === id ? { ...s, ...newData } : s);
      } else if (type.startsWith('feature') || type === 'feature') {
        console.log('✅ Updating feature:', id);
        updated.features = prev.features.map(f => f.id === id ? { ...f, ...newData } : f);
      } else {
        console.error('❌ Unknown element type:', type);
      }

      console.log('📦 Updated pageData:', updated);
      return updated;
    });
  };

  const handleDelete = (id) => {
    setPageData(prev => {
      const updated = { ...prev };

      if (selectedElement.type.startsWith('category')) {
        updated.categories = prev.categories.filter(c => c.id !== id);
      } else if (selectedElement.type.startsWith('streamer')) {
        updated.streamers = prev.streamers.filter(s => s.id !== id);
      } else if (selectedElement.type.startsWith('feature')) {
        updated.features = prev.features.filter(f => f.id !== id);
      }

      return updated;
    });
    setSelectedElement(null);
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: `cat${Date.now()}`,
      name: 'New Category',
      icon: 'Target',
      iconImage: null,
      gradient: 'from-purple-500 to-pink-500'
    };
    
    setPageData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    
    setSelectedElement({ id: newCategory.id, type: 'category', data: newCategory });
  };

  const handleAddStreamer = () => {
    const newStreamer = {
      id: `str${Date.now()}`,
      name: 'New Streamer',
      viewers: '0K',
      image: 'https://i.pravatar.cc/300?img=1',
      profileUrl: '',
      isLive: true
    };
    
    setPageData(prev => ({
      ...prev,
      streamers: [...prev.streamers, newStreamer]
    }));
    
    setSelectedElement({ id: newStreamer.id, type: 'streamer-card', data: newStreamer });
  };

  const getIcon = (iconName) => {
    const icons = {
      Target, Swords, Trophy, Dices, Gamepad2, Play,
      Headphones, Lock, Award, Users, Crown, Smartphone
    };
    return icons[iconName] || Target;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 shadow-xl">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Visual Editor
              </h1>
              {!isOnline && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
                  <WifiOff className="w-4 h-4" />
                  Offline Mode
                </div>
              )}
            </div>

            {/* Center: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('/', '_blank')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={saveData}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 font-medium"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Visual Preview */}
      <div className="pt-20 pb-10">
        <div className={`max-w-full transition-all duration-300 ${selectedElement ? 'pr-96' : ''}`}>
          {/* Instructions Banner */}
          <div className="max-w-7xl mx-auto px-6 py-4 mb-6">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cyan-300 font-medium">Click any element to edit</p>
                <p className="text-cyan-400/70 text-sm mt-1">
                  Hover over elements to see edit badges. Changes are auto-saved to localStorage.
                </p>
              </div>
            </div>
          </div>

          {/* Editable Landing Page Preview */}
          <div className="min-h-screen bg-[#0a0a1a] text-white">
            {/* Header */}
            <EditableElement
              id="header"
              type="header"
              isSelected={selectedElement?.type === 'header'}
              onClick={handleElementClick}
            >
              <header className="bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                        {pageData.header.siteName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-300">Login</button>
                      <button className="px-6 py-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full font-medium">
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </header>
            </EditableElement>

            {/* Hero Section */}
            <EditableElement
              id="hero"
              type="hero"
              isSelected={selectedElement?.type === 'hero'}
              onClick={handleElementClick}
              className="py-20"
            >
              <section className="min-h-[600px] flex items-center">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                      {pageData.hero.title.split(' ').slice(0, 2).join(' ')}{' '}
                      <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                        {pageData.hero.title.split(' ').slice(2).join(' ')}
                      </span>
                    </h1>
                    <p className="text-xl text-gray-400">{pageData.hero.subtitle}</p>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-8 py-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-lg font-semibold">
                        {pageData.hero.primaryButtonText}
                      </button>
                      <button className="px-8 py-4 border-2 border-[#a855f7] text-[#a855f7] rounded-lg font-semibold">
                        {pageData.hero.secondaryButtonText}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-[500px] bg-gradient-to-br from-[#a855f7]/20 via-[#ec4899]/20 to-purple-900/20 rounded-3xl border border-[#a855f7]/30 backdrop-blur-sm flex items-center justify-center">
                      <Users className="w-32 h-32 text-[#a855f7]/40" />
                    </div>
                  </div>
                </div>
              </section>
            </EditableElement>

            {/* Categories */}
            <section className="py-20 bg-[#0f0f23]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {pageData.categories.map((category, index) => {
                    const IconComponent = getIcon(category.icon);
                    return (
                      <EditableElement
                        key={category.id}
                        id={category.id}
                        type="category"
                        isSelected={selectedElement?.id === category.id}
                        onClick={handleElementClick}
                      >
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-xl p-6 hover:border-[#a855f7] transition-all cursor-pointer">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center overflow-hidden`}>
                            {category.iconImage ? (
                              <img src={category.iconImage} className="w-full h-full object-cover" alt={category.name} />
                            ) : (
                              <IconComponent className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <p className="text-center text-sm font-medium text-gray-300">
                            {category.name}
                          </p>
                        </div>
                      </EditableElement>
                    );
                  })}
                </div>
                
                {/* Add Category Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 transition-all font-medium shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Category
                  </button>
                </div>
              </div>
            </section>

            {/* VIP Banner */}
            <EditableElement
              id="vip-banner"
              type="vip-banner"
              isSelected={selectedElement?.type === 'vip-banner'}
              onClick={handleElementClick}
              className="py-20"
            >
              <section className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fbbf24] via-[#a855f7] to-[#ec4899] p-1">
                  <div className="bg-[#0a0a1a] rounded-[22px] p-12">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#fbbf24] to-orange-500 rounded-full flex items-center justify-center">
                          <Crown className="w-12 h-12 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-3">{pageData.vipBanner.title}</h3>
                          <p className="text-gray-300 text-lg mb-6">{pageData.vipBanner.description}</p>
                          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-[#fbbf24] text-white rounded-lg font-semibold">
                            {pageData.vipBanner.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </EditableElement>

            {/* Streamers */}
            <section className="py-20 bg-[#0f0f23]">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-5xl font-bold mb-16 text-center">Streamer Spotlight</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pageData.streamers.map((streamer) => {
                    const cardContent = (
                      <div className="bg-[#0a0a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-[#a855f7] transition-all">
                        <div className="relative">
                          <img 
                            src={streamer.image} 
                            alt={streamer.name}
                            className="w-full h-72 object-cover"
                          />
                          {streamer.isLive && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center space-x-1.5">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              <span>LIVE</span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-sm rounded-full flex items-center space-x-1.5">
                            <Users className="w-4 h-4" />
                            <span>{streamer.viewers}</span>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold">{streamer.name}</h3>
                            <p className="text-gray-400 text-sm">Streamer</p>
                          </div>
                          <button className="w-full py-3 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-lg font-semibold">
                            Follow
                          </button>
                        </div>
                      </div>
                    );
                    
                    return (
                      <EditableElement
                        key={streamer.id}
                        id={streamer.id}
                        type="streamer-card"
                        isSelected={selectedElement?.id === streamer.id}
                        onClick={handleElementClick}
                        isDraggable
                      >
                        {streamer.profileUrl ? (
                          <a href={streamer.profileUrl} target="_blank" rel="noopener noreferrer">
                            {cardContent}
                          </a>
                        ) : (
                          cardContent
                        )}
                      </EditableElement>
                    );
                  })}
                </div>
                
                {/* Add Streamer Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleAddStreamer}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 transition-all font-medium shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Streamer
                  </button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {pageData.features.map((feature) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                      <EditableElement
                        key={feature.id}
                        id={feature.id}
                        type="feature"
                        isSelected={selectedElement?.id === feature.id}
                        onClick={handleElementClick}
                      >
                        <div className="bg-[#0f0f23] border border-gray-800 rounded-xl p-8 hover:border-[#a855f7] transition-all">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-xl flex items-center justify-center mb-6">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                          <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                      </EditableElement>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Download Section */}
            <EditableElement
              id="download-section"
              type="download-section"
              isSelected={selectedElement?.type === 'download-section'}
              onClick={handleElementClick}
            >
              <section className="py-20 bg-[#0f0f23]">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="w-full max-w-sm mx-auto h-[600px] bg-gradient-to-br from-[#a855f7]/30 via-[#ec4899]/30 to-purple-900/20 rounded-[3rem] border-8 border-gray-800 flex items-center justify-center">
                      <Smartphone className="w-24 h-24 text-[#a855f7]/50" />
                    </div>
                    <div className="space-y-8">
                      <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                        {pageData.downloadSection.heading}<br />
                        <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                          {pageData.downloadSection.subheading}
                        </span>
                      </h2>
                      <p className="text-xl text-gray-400">{pageData.downloadSection.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all">
                          App Store
                        </button>
                        <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all">
                          Google Play
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </EditableElement>

            {/* Footer */}
            <footer className="bg-[#0a0a1a] border-t border-gray-800 py-16">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-gray-400">&copy; 2024 StreamerLive. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElement && (
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
}

export default VisualEditor;
