import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

function SectionEditor() {
  const [sections, setSections] = useState({
    hero: {
      title: 'Experience Live Streaming Like Never Before',
      subtitle: 'Join thousands of streamers and viewers in the ultimate live streaming platform',
      ctaButtons: [
        { text: 'Start Streaming', link: '/signup', primary: true },
        { text: 'Watch Now', link: '/browse', primary: false }
      ]
    },
    features: [
      {
        id: 1,
        title: 'HD Quality Streaming',
        description: 'Crystal clear 1080p and 4K streaming with low latency',
        icon: 'video'
      },
      {
        id: 2,
        title: 'Interactive Chat',
        description: 'Engage with your audience in real-time with our advanced chat system',
        icon: 'message'
      },
      {
        id: 3,
        title: 'Monetization Tools',
        description: 'Multiple ways to earn: subscriptions, donations, and sponsorships',
        icon: 'dollar'
      },
      {
        id: 4,
        title: 'Mobile Streaming',
        description: 'Stream anywhere with our mobile apps for iOS and Android',
        icon: 'smartphone'
      }
    ],
    vipBanner: {
      title: 'Become a VIP Member',
      description: 'Unlock exclusive features, custom badges, and priority support',
      ctaText: 'Upgrade Now',
      ctaLink: '/vip'
    },
    download: {
      title: 'Download Our Apps',
      subtitle: 'Stream and watch on any device',
      platforms: ['iOS', 'Android', 'Windows', 'macOS']
    },
    footer: {
      description: 'StreamerLive - The ultimate platform for live streaming',
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com'
      }
    }
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (section, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (section, index, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section, subField, field, value) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subField]: {
          ...prev[section][subField],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const addFeature = () => {
    setSections(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: Date.now(),
          title: 'New Feature',
          description: 'Feature description',
          icon: 'star'
        }
      ]
    }));
    setHasChanges(true);
  };

  const deleteFeature = (index) => {
    if (!confirm('Delete this feature?')) return;
    setSections(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Sections saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving sections:', err);
      alert('Failed to save sections');
    } finally {
      setSaving(false);
    }
  };

  const SectionTab = ({ id, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`
        px-6 py-3 rounded-lg font-medium transition-all
        ${activeSection === id
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Section Editor
          </h1>
          <p className="text-gray-400">Edit all content sections on your landing page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
            ${hasChanges && !saving
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-3">
        <SectionTab id="hero" label="Hero Section" />
        <SectionTab id="features" label="Features" />
        <SectionTab id="vipBanner" label="VIP Banner" />
        <SectionTab id="download" label="Download Section" />
        <SectionTab id="footer" label="Footer" />
      </div>

      {/* Hero Section Editor */}
      {activeSection === 'hero' && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold">Hero Section</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={sections.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <textarea
              value={sections.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              rows={3}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">CTA Buttons</label>
            <div className="space-y-3">
              {sections.hero.ctaButtons.map((btn, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={btn.text}
                      onChange={(e) => {
                        const newButtons = [...sections.hero.ctaButtons];
                        newButtons[index].text = e.target.value;
                        handleInputChange('hero', 'ctaButtons', newButtons);
                      }}
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Link URL</label>
                    <input
                      type="text"
                      value={btn.link}
                      onChange={(e) => {
                        const newButtons = [...sections.hero.ctaButtons];
                        newButtons[index].link = e.target.value;
                        handleInputChange('hero', 'ctaButtons', newButtons);
                      }}
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Editor */}
      {activeSection === 'features' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Feature Cards</h2>
            <button
              onClick={addFeature}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Feature
            </button>
          </div>

          <div className="grid gap-4">
            {sections.features.map((feature, index) => (
              <div key={feature.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">Feature {index + 1}</h3>
                  <button
                    onClick={() => deleteFeature(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <select
                      value={feature.icon}
                      onChange={(e) => handleArrayChange('features', index, 'icon', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="video">Video</option>
                      <option value="message">Message</option>
                      <option value="dollar">Dollar</option>
                      <option value="smartphone">Smartphone</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIP Banner Editor */}
      {activeSection === 'vipBanner' && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold">VIP Banner Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={sections.vipBanner.title}
              onChange={(e) => handleInputChange('vipBanner', 'title', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={sections.vipBanner.description}
              onChange={(e) => handleInputChange('vipBanner', 'description', e.target.value)}
              rows={3}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={sections.vipBanner.ctaText}
                onChange={(e) => handleInputChange('vipBanner', 'ctaText', e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Button Link</label>
              <input
                type="text"
                value={sections.vipBanner.ctaLink}
                onChange={(e) => handleInputChange('vipBanner', 'ctaLink', e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Download Section Editor */}
      {activeSection === 'download' && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold">Download Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={sections.download.title}
              onChange={(e) => handleInputChange('download', 'title', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={sections.download.subtitle}
              onChange={(e) => handleInputChange('download', 'subtitle', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Footer Editor */}
      {activeSection === 'footer' && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold">Footer Section</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={sections.footer.description}
              onChange={(e) => handleInputChange('footer', 'description', e.target.value)}
              rows={2}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">Social Media Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sections.footer.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">{platform}</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleNestedChange('footer', 'socialLinks', platform, e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder={`https://${platform}.com`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionEditor;
