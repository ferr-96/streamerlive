import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Eye, Undo, Redo, Plus, AlertCircle, WifiOff, Check,
  Play, Crown, Target, Swords, Trophy, Dices, Gamepad2,
  Users, Headphones, Lock, Award, Smartphone
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EditableElement from '../../components/admin/EditableElement';
import PropertiesPanel from '../../components/admin/PropertiesPanel';
import api from '../../services/api';

const STORAGE_KEY = 'streamerlive_editor_data';
const API_BASE = import.meta.env.VITE_API_URL || 'http://139.59.242.118:3001/api';

// Default section templates for adding/resetting
const DEFAULT_SECTIONS = {
  header: { siteName: 'StreamerLive', logo: null },
  hero: { id: 'hero1', title: 'Join Elite Streamers', subtitle: 'A premium gaming livestream platform', primaryButtonText: 'CTA Streamers', primaryButtonLink: '#', secondaryButtonText: 'Sign Up', secondaryButtonLink: '#', characterImage: null, layout: 'left', size: 'full' },
  vipBanner: { id: 'vip1', title: 'VIP Rewards Banner', description: 'Get rewards and countless premium gaming livestream platform', buttonText: 'Get Started', buttonLink: '#', backgroundImage: null, size: 'large' },
  downloadSection: { id: 'dl1', heading: 'Download App', subheading: 'Stream Anywhere', description: 'Stream your app to discover premium gaming livestreams', appStoreText: 'App Store', appStoreLink: '#', playStoreText: 'Google Play', playStoreLink: '#', phoneMockup: null, layout: 'left' },
  textBlock: { id: 'text1', content: 'Add your text content here. Click to edit and customize this section.', alignment: 'left', fontSize: 'base' },
  newCategory: { name: 'New Category', icon: 'Target', iconImage: '', gradient: 'from-purple-500 to-pink-500' },
  newStreamer: { name: 'New Streamer', viewers: '0K', image: 'https://i.pravatar.cc/300?img=1', isLive: true, profileUrl: '' },
  newFeature: { icon: 'Award', iconImage: '', title: 'New Feature', description: 'Feature description here', link: '' },
};

/**
 * VisualEditor - WYSIWYG page builder for StreamerLive
 */
function VisualEditor() {
  // Editor State
  const [selectedElement, setSelectedElement] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Page Content State with fallback data
  const [pageData, setPageData] = useState({
    header: {
      siteName: 'StreamerLive',
      logo: null
    },
    // Section arrays for dynamic content
    heroSections: [
      {
        id: 'hero1',
        title: 'Join Elite Streamers',
        subtitle: 'A premium gaming livestream platform',
        primaryButtonText: 'CTA Streamers',
        primaryButtonLink: '#',
        secondaryButtonText: 'Sign Up',
        secondaryButtonLink: '#',
        characterImage: null,
        layout: 'left',
        size: 'full'
      }
    ],
    categoriesSection: {
      columns: '6',
      style: 'cards'
    },
    vipBanners: [
      {
        id: 'vip1',
        title: 'VIP Rewards Banner',
        description: 'Get rewards and countless premium gaming livestream platform',
        buttonText: 'Get Started',
        buttonLink: '#',
        backgroundImage: null,
        size: 'large'
      }
    ],
    categories: [
      { id: 'cat1', name: 'Battle Royale', icon: 'Target', gradient: 'from-purple-500 to-pink-500' },
      { id: 'cat2', name: 'RPG', icon: 'Swords', gradient: 'from-pink-500 to-purple-600' },
      { id: 'cat3', name: 'Sports', icon: 'Trophy', gradient: 'from-purple-600 to-pink-400' },
      { id: 'cat4', name: 'Casino', icon: 'Dices', gradient: 'from-pink-400 to-purple-500' },
      { id: 'cat5', name: 'Strategy', icon: 'Gamepad2', gradient: 'from-purple-500 to-pink-600' },
      { id: 'cat6', name: 'Arcade', icon: 'Play', gradient: 'from-pink-600 to-purple-400' },
    ],
    streamersSection: {
      columns: '4',
      cardSize: 'medium'
    },
    streamers: [
      { id: 'str1', name: 'Atherton', viewers: '24.5K', image: 'https://i.pravatar.cc/300?img=12', isLive: true, profileUrl: '' },
      { id: 'str2', name: 'Nana', viewers: '18.2K', image: 'https://i.pravatar.cc/300?img=45', isLive: true, profileUrl: '' },
      { id: 'str3', name: 'Geertan', viewers: '32.1K', image: 'https://i.pravatar.cc/300?img=33', isLive: true, profileUrl: '' },
      { id: 'str4', name: 'Monika', viewers: '15.8K', image: 'https://i.pravatar.cc/300?img=47', isLive: true, profileUrl: '' },
    ],
    featuresSection: {
      columns: '3',
      style: 'cards'
    },
    downloadSections: [
      {
        id: 'dl1',
        heading: 'Download App',
        subheading: 'Stream Anywhere',
        description: 'Stream your app to discover premium gaming livestreams',
        appStoreText: 'App Store',
        appStoreLink: '#',
        playStoreText: 'Google Play',
        playStoreLink: '#',
        phoneMockup: null,
        layout: 'left'
      }
    ],
    textBlocks: [],
    features: [
      { id: 'feat1', icon: 'Headphones', iconImage: '', title: '24/7 Support', description: 'Get help anytime, anywhere with our dedicated support team ready to assist you.', link: '' },
      { id: 'feat2', icon: 'Lock', iconImage: '', title: 'Secure Platform', description: 'Your data is protected with enterprise-grade security and encryption protocols.', link: '' },
      { id: 'feat3', icon: 'Award', iconImage: '', title: 'Instant Rewards', description: 'Earn points and unlock exclusive benefits immediately as you stream and engage.', link: '' },
    ],
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

  // NOTE: Removed auto-save - now only saves when Save button is clicked

  const loadData = async () => {
    try {
      // Try loading from localStorage first
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        let data = JSON.parse(cached);
        
        // Backwards compatibility: convert old single objects to arrays
        if (data.hero && !data.heroSections) {
          data.heroSections = [{ ...data.hero, id: data.hero.id || 'hero1' }];
          delete data.hero;
        }
        if (data.vipBanner && !data.vipBanners) {
          data.vipBanners = [{ ...data.vipBanner, id: data.vipBanner.id || 'vip1' }];
          delete data.vipBanner;
        }
        if (data.downloadSection && !data.downloadSections) {
          data.downloadSections = [{ ...data.downloadSection, id: data.downloadSection.id || 'dl1' }];
          delete data.downloadSection;
        }
        if (!data.textBlocks) {
          data.textBlocks = [];
        }
        
        setPageData(data);
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
      // Save to localStorage
      console.log('💾 Saving to localStorage:', pageData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
      console.log('✅ localStorage.setItem called with key:', STORAGE_KEY);
      
      // Dispatch custom event so landing page updates
      window.dispatchEvent(new CustomEvent('streamerlive-data-updated'));
      console.log('📢 Dispatched streamerlive-data-updated event');

      // Try saving to API
      if (isOnline) {
        // In production, send to respective endpoints
        // For now, just simulate
        await new Promise(resolve => setTimeout(resolve, 300));
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
      data = pageData.heroSections?.find(h => h.id === id);
    } else if (type === 'vip-banner') {
      data = pageData.vipBanners?.find(v => v.id === id);
    } else if (type === 'download-section') {
      data = pageData.downloadSections?.find(d => d.id === id);
    } else if (type === 'text-block') {
      data = pageData.textBlocks?.find(t => t.id === id);
    } else if (type === 'categories-section') {
      data = pageData.categoriesSection;
    } else if (type === 'streamers-section') {
      data = pageData.streamersSection;
    } else if (type === 'features-section') {
      data = pageData.featuresSection;
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
        console.log('✅ Updating hero section');
        updated.heroSections = prev.heroSections.map(h => h.id === id ? { ...h, ...newData } : h);
      } else if (type === 'vip-banner') {
        console.log('✅ Updating vip-banner');
        updated.vipBanners = prev.vipBanners.map(v => v.id === id ? { ...v, ...newData } : v);
      } else if (type === 'download-section') {
        console.log('✅ Updating download-section');
        updated.downloadSections = prev.downloadSections.map(d => d.id === id ? { ...d, ...newData } : d);
      } else if (type === 'text-block') {
        console.log('✅ Updating text-block');
        updated.textBlocks = prev.textBlocks.map(t => t.id === id ? { ...t, ...newData } : t);
      } else if (type === 'categories-section') {
        console.log('✅ Updating categories-section');
        updated.categoriesSection = newData;
      } else if (type === 'streamers-section') {
        console.log('✅ Updating streamers-section');
        updated.streamersSection = newData;
      } else if (type === 'features-section') {
        console.log('✅ Updating features-section');
        updated.featuresSection = newData;
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

      if (selectedElement.type === 'hero') {
        updated.heroSections = prev.heroSections.filter(h => h.id !== id);
      } else if (selectedElement.type === 'vip-banner') {
        updated.vipBanners = prev.vipBanners.filter(v => v.id !== id);
      } else if (selectedElement.type === 'download-section') {
        updated.downloadSections = prev.downloadSections.filter(d => d.id !== id);
      } else if (selectedElement.type === 'text-block') {
        updated.textBlocks = prev.textBlocks.filter(t => t.id !== id);
      } else if (selectedElement.type.startsWith('category')) {
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

  // Reset a section to default
  const handleResetSection = (sectionName) => {
    if (confirm(`Reset ${sectionName} to default? This will overwrite your current changes.`)) {
      setPageData(prev => ({
        ...prev,
        [sectionName]: DEFAULT_SECTIONS[sectionName]
      }));
      setShowAddMenu(false);
    }
  };

  // Add a new section (hero, vipBanner, downloadSection, textBlock)
  const handleAddSection = (sectionType) => {
    const templates = {
      hero: { 
        ...DEFAULT_SECTIONS.hero,
        id: `hero${Date.now()}`,
        title: 'New Hero Section',
        subtitle: 'Your subtitle here'
      },
      vipBanner: { 
        ...DEFAULT_SECTIONS.vipBanner,
        id: `vip${Date.now()}`,
        title: 'New VIP Banner',
        description: 'VIP banner description'
      },
      download: { 
        ...DEFAULT_SECTIONS.downloadSection,
        id: `dl${Date.now()}`,
        heading: 'New Download Section'
      },
      textBlock: { 
        ...DEFAULT_SECTIONS.textBlock,
        id: `text${Date.now()}`,
        content: 'Add your text content here'
      },
    };

    const newSection = templates[sectionType];
    if (!newSection) return;

    setPageData(prev => {
      const updated = { ...prev };
      
      if (sectionType === 'hero') {
        updated.heroSections = [...(prev.heroSections || []), newSection];
      } else if (sectionType === 'vipBanner') {
        updated.vipBanners = [...(prev.vipBanners || []), newSection];
      } else if (sectionType === 'download') {
        updated.downloadSections = [...(prev.downloadSections || []), newSection];
      } else if (sectionType === 'textBlock') {
        updated.textBlocks = [...(prev.textBlocks || []), newSection];
      }
      
      return updated;
    });

    // Auto-select the new section
    const typeMap = {
      hero: 'hero',
      vipBanner: 'vip-banner',
      download: 'download-section',
      textBlock: 'text-block'
    };
    setSelectedElement({ id: newSection.id, type: typeMap[sectionType], data: newSection });
    setShowAddMenu(false);
  };

  // Add a new item to an array section
  const handleAddItem = (sectionName) => {
    const templateKey = `new${sectionName.charAt(0).toUpperCase() + sectionName.slice(1, -1)}`;
    const template = DEFAULT_SECTIONS[templateKey];
    if (!template) return;

    const newItem = {
      ...template,
      id: `${sectionName.slice(0, -1)}${Date.now()}`
    };

    setPageData(prev => ({
      ...prev,
      [sectionName]: [...(prev[sectionName] || []), newItem]
    }));
    setShowAddMenu(false);
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Determine which array we're reordering
    const activeId = active.id;
    const overId = over.id;

    // Check categories
    const categoryIds = pageData.categories.map(c => c.id);
    if (categoryIds.includes(activeId) && categoryIds.includes(overId)) {
      setPageData(prev => {
        const oldIndex = prev.categories.findIndex(c => c.id === activeId);
        const newIndex = prev.categories.findIndex(c => c.id === overId);
        return {
          ...prev,
          categories: arrayMove(prev.categories, oldIndex, newIndex)
        };
      });
      return;
    }

    // Check streamers
    const streamerIds = pageData.streamers.map(s => s.id);
    if (streamerIds.includes(activeId) && streamerIds.includes(overId)) {
      setPageData(prev => {
        const oldIndex = prev.streamers.findIndex(s => s.id === activeId);
        const newIndex = prev.streamers.findIndex(s => s.id === overId);
        return {
          ...prev,
          streamers: arrayMove(prev.streamers, oldIndex, newIndex)
        };
      });
      return;
    }

    // Check features
    const featureIds = pageData.features.map(f => f.id);
    if (featureIds.includes(activeId) && featureIds.includes(overId)) {
      setPageData(prev => {
        const oldIndex = prev.features.findIndex(f => f.id === activeId);
        const newIndex = prev.features.findIndex(f => f.id === overId);
        return {
          ...prev,
          features: arrayMove(prev.features, oldIndex, newIndex)
        };
      });
      return;
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Target, Swords, Trophy, Dices, Gamepad2, Play,
      Headphones, Lock, Award, Users, Crown, Smartphone
    };
    return icons[iconName] || Target;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
              
              {/* Add/Reset Section Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add / Reset
                </button>
                
                {showAddMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold px-2">Add New Section</p>
                    </div>
                    <div className="p-1">
                      <button onClick={() => handleAddSection('hero')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Hero Section</button>
                      <button onClick={() => handleAddSection('vipBanner')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add VIP Banner</button>
                      <button onClick={() => handleAddSection('download')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Download Section</button>
                      <button onClick={() => handleAddSection('textBlock')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Text Block</button>
                    </div>
                    <div className="p-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold px-2">Add New Item</p>
                    </div>
                    <div className="p-1">
                      <button onClick={() => handleAddItem('categories')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Category</button>
                      <button onClick={() => handleAddItem('streamers')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Streamer</button>
                      <button onClick={() => handleAddItem('features')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">➕ Add Feature</button>
                    </div>
                    <div className="p-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold px-2">Reset to Default</p>
                    </div>
                    <div className="p-1">
                      <button onClick={() => handleResetSection('header')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">🔄 Header</button>
                    </div>
                  </div>
                )}
              </div>
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

            {/* Hero Sections */}
            {pageData.heroSections?.map((hero) => (
              <EditableElement
                key={hero.id}
                id={hero.id}
                type="hero"
                isSelected={selectedElement?.id === hero.id}
                onClick={handleElementClick}
                className="py-20"
              >
                <section className={`flex items-center ${
                  hero.size === 'full' ? 'min-h-screen' : 
                  hero.size === 'medium' ? 'min-h-[500px]' : 
                  'min-h-[300px]'
                }`}>
                  <div className={`max-w-7xl mx-auto px-6 grid gap-12 items-center ${
                    hero.layout === 'center' ? 'grid-cols-1 text-center' :
                    hero.layout === 'right' ? 'md:grid-cols-2' : 
                    'md:grid-cols-2'
                  } ${hero.layout === 'right' ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    <div className="space-y-8">
                      <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                        {hero.title.split(' ').slice(0, 2).join(' ')}{' '}
                        <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                          {hero.title.split(' ').slice(2).join(' ')}
                        </span>
                      </h1>
                      <p className="text-xl text-gray-400">{hero.subtitle}</p>
                      <div className={`flex flex-wrap gap-4 ${hero.layout === 'center' ? 'justify-center' : ''}`}>
                        <button className="px-8 py-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-lg font-semibold">
                          {hero.primaryButtonText}
                        </button>
                        <button className="px-8 py-4 border-2 border-[#a855f7] text-[#a855f7] rounded-lg font-semibold">
                          {hero.secondaryButtonText}
                        </button>
                      </div>
                    </div>
                    {hero.layout !== 'center' && (
                      <div className="relative">
                        <div className="w-full h-[500px] bg-gradient-to-br from-[#a855f7]/20 via-[#ec4899]/20 to-purple-900/20 rounded-3xl border border-[#a855f7]/30 backdrop-blur-sm flex items-center justify-center">
                          <Users className="w-32 h-32 text-[#a855f7]/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </EditableElement>
            ))}

            {/* Categories */}
            <section className="py-20 bg-[#0f0f23]">
              <div className="max-w-7xl mx-auto px-6">
                {/* Section-level edit badge */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => handleElementClick('categories-section', 'categories-section')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedElement?.type === 'categories-section'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    ⚙️ Section Layout
                  </button>
                </div>
                <SortableContext
                  items={pageData.categories.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${pageData.categoriesSection?.columns || '6'} gap-6`}>
                  {pageData.categories.map((category, index) => {
                    const IconComponent = getIcon(category.icon);
                    return (
                      <EditableElement
                        key={category.id}
                        id={category.id}
                        type="category"
                        isSelected={selectedElement?.id === category.id}
                        onClick={handleElementClick}
                        isDraggable={true}
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
                </SortableContext>
                
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

            {/* VIP Banners */}
            {pageData.vipBanners?.map((vipBanner) => (
              <EditableElement
                key={vipBanner.id}
                id={vipBanner.id}
                type="vip-banner"
                isSelected={selectedElement?.id === vipBanner.id}
                onClick={handleElementClick}
                className="py-20"
              >
                <section className="max-w-7xl mx-auto px-6">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fbbf24] via-[#a855f7] to-[#ec4899] p-1">
                    <div className={`bg-[#0a0a1a] rounded-[22px] ${
                      vipBanner.size === 'large' ? 'p-12' :
                      vipBanner.size === 'medium' ? 'p-8' :
                      'p-6'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-6">
                          <div className={`bg-gradient-to-br from-[#fbbf24] to-orange-500 rounded-full flex items-center justify-center ${
                            vipBanner.size === 'large' ? 'w-20 h-20' :
                            vipBanner.size === 'medium' ? 'w-16 h-16' :
                            'w-12 h-12'
                          }`}>
                            <Crown className={`text-white ${
                              vipBanner.size === 'large' ? 'w-12 h-12' :
                              vipBanner.size === 'medium' ? 'w-8 h-8' :
                              'w-6 h-6'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-bold mb-3 ${
                              vipBanner.size === 'large' ? 'text-3xl' :
                              vipBanner.size === 'medium' ? 'text-2xl' :
                              'text-xl'
                            }`}>{vipBanner.title}</h3>
                            <p className={`text-gray-300 mb-6 ${
                              vipBanner.size === 'large' ? 'text-lg' :
                              vipBanner.size === 'medium' ? 'text-base' :
                              'text-sm'
                            }`}>{vipBanner.description}</p>
                            <button className={`bg-gradient-to-r from-orange-500 to-[#fbbf24] text-white rounded-lg font-semibold ${
                              vipBanner.size === 'large' ? 'px-8 py-3' :
                              vipBanner.size === 'medium' ? 'px-6 py-2.5' :
                              'px-4 py-2 text-sm'
                            }`}>
                              {vipBanner.buttonText}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </EditableElement>
            ))}

            {/* Streamers */}
            <section className="py-20 bg-[#0f0f23]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-5xl font-bold">Streamer Spotlight</h2>
                  <button
                    onClick={() => handleElementClick('streamers-section', 'streamers-section')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedElement?.type === 'streamers-section'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    ⚙️ Section Layout
                  </button>
                </div>
                <SortableContext
                  items={pageData.streamers.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${pageData.streamersSection?.columns || '4'} gap-6 mt-16`}>
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
                </SortableContext>
                
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
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => handleElementClick('features-section', 'features-section')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedElement?.type === 'features-section'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    ⚙️ Section Layout
                  </button>
                </div>
                <SortableContext
                  items={pageData.features.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                <div className={`grid grid-cols-1 md:grid-cols-${pageData.featuresSection?.columns || '3'} gap-8`}>
                  {pageData.features.map((feature) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                      <EditableElement
                        key={feature.id}
                        id={feature.id}
                        type="feature"
                        isSelected={selectedElement?.id === feature.id}
                        onClick={handleElementClick}
                        isDraggable={true}
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
                </SortableContext>
              </div>
            </section>

            {/* Download Sections */}
            {pageData.downloadSections?.map((downloadSection) => (
              <EditableElement
                key={downloadSection.id}
                id={downloadSection.id}
                type="download-section"
                isSelected={selectedElement?.id === downloadSection.id}
                onClick={handleElementClick}
              >
                <section className="py-20 bg-[#0f0f23]">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className={`grid gap-16 items-center ${
                      downloadSection.layout === 'center' ? 'grid-cols-1 text-center' :
                      'md:grid-cols-2'
                    } ${downloadSection.layout === 'right' ? 'md:[&>*:first-child]:order-2' : ''}`}>
                      {downloadSection.layout !== 'center' && (
                        <div className="w-full max-w-sm mx-auto h-[600px] bg-gradient-to-br from-[#a855f7]/30 via-[#ec4899]/30 to-purple-900/20 rounded-[3rem] border-8 border-gray-800 flex items-center justify-center overflow-hidden">
                          {downloadSection.phoneMockup ? (
                            <img 
                              src={downloadSection.phoneMockup} 
                              alt="Phone mockup" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Smartphone className="w-24 h-24 text-[#a855f7]/50" />
                          )}
                        </div>
                      )}
                      <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                          {downloadSection.heading}<br />
                          <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                            {downloadSection.subheading}
                          </span>
                        </h2>
                        <p className="text-xl text-gray-400">{downloadSection.description}</p>
                        <div className={`flex flex-wrap gap-4 ${downloadSection.layout === 'center' ? 'justify-center' : ''}`}>
                          <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all">
                            {downloadSection.appStoreText || 'App Store'}
                          </button>
                          <button className="px-6 py-4 bg-[#0a0a1a] border border-gray-700 rounded-xl hover:border-[#a855f7] transition-all">
                            {downloadSection.playStoreText || 'Google Play'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </EditableElement>
            ))}

            {/* Text Blocks */}
            {pageData.textBlocks?.map((textBlock) => (
              <EditableElement
                key={textBlock.id}
                id={textBlock.id}
                type="text-block"
                isSelected={selectedElement?.id === textBlock.id}
                onClick={handleElementClick}
              >
                <section className="py-20">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-${textBlock.alignment || 'left'} text-${textBlock.fontSize || 'base'}`}>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {textBlock.content}
                      </p>
                    </div>
                  </div>
                </section>
              </EditableElement>
            ))}

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
    </DndContext>
  );
}

export default VisualEditor;
