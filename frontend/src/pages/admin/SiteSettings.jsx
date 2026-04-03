import { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, Palette, Link as LinkIcon } from 'lucide-react';

function SiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'StreamerLive',
    logoUrl: '/logo.png',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#8b5cf6'
    },
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      discord: '',
      twitch: ''
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleColorChange = (colorKey, value) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSocialChange = (platform, value) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    setHasChanges(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // In a real app, upload to your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate uploaded URL
      const mockUrl = URL.createObjectURL(file);
      handleInputChange('logoUrl', mockUrl);
      
      alert('Logo uploaded successfully!');
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, save to API endpoint: PUT /api/settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Settings saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const ColorPicker = ({ label, value, onChange, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-600 bg-gray-700"
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              backgroundColor: value,
              opacity: 0.3
            }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#a855f7"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono"
          />
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Site Settings
          </h1>
          <p className="text-gray-400">Customize your site's branding and appearance</p>
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

      {/* Logo Section */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Site Logo</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-500" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <label
              htmlFor="logo-upload"
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all
                ${uploading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              `}
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload New Logo'}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-sm text-gray-400">
              Recommended: PNG or SVG, max 2MB, square format (500x500px)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="StreamerLive"
          />
        </div>
      </div>

      {/* Color Theme Section */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Color Theme</h2>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Primary Color"
            value={settings.colors.primary}
            onChange={(val) => handleColorChange('primary', val)}
            description="Main brand color used for buttons and accents"
          />

          <ColorPicker
            label="Secondary Color"
            value={settings.colors.secondary}
            onChange={(val) => handleColorChange('secondary', val)}
            description="Secondary brand color for gradients and highlights"
          />

          <ColorPicker
            label="Accent Color"
            value={settings.colors.accent}
            onChange={(val) => handleColorChange('accent', val)}
            description="Accent color for hover states and special elements"
          />
        </div>

        {/* Preview */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-sm font-medium mb-3">Color Preview</p>
          <div className="flex gap-3">
            <div
              className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: settings.colors.primary }}
            >
              Primary
            </div>
            <div
              className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: settings.colors.secondary }}
            >
              Secondary
            </div>
            <div
              className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: settings.colors.accent }}
            >
              Accent
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <LinkIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Social Media Links</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleSocialChange(platform, e.target.value)}
                placeholder={`https://${platform}.com/yourprofile`}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          Leave fields empty to hide social icons from the footer
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
        <p className="text-sm text-gray-300">
          Reset all settings to default values. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
              setSettings({
                siteName: 'StreamerLive',
                logoUrl: '/logo.png',
                colors: {
                  primary: '#a855f7',
                  secondary: '#ec4899',
                  accent: '#8b5cf6'
                },
                socialLinks: {
                  facebook: '',
                  twitter: '',
                  instagram: '',
                  youtube: '',
                  discord: '',
                  twitch: ''
                }
              });
              setHasChanges(true);
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default SiteSettings;
