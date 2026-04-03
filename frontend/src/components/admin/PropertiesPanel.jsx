import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Trash2,
  Save, Image as ImageIcon, Type, Link as LinkIcon,
  Palette, Layout, Eye, Check
} from 'lucide-react';

/**
 * PropertiesPanel - Right sidebar for editing selected elements
 */
function PropertiesPanel({ selectedElement, onUpdate, onDelete, onClose }) {
  const [formData, setFormData] = useState(selectedElement?.data || {});
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

  // Sync formData when selectedElement changes
  useEffect(() => {
    if (selectedElement?.data) {
      setFormData(selectedElement.data);
      setSaveStatus('idle');
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    console.log('🔍 PropertiesPanel handleChange called:', { field, value, id: selectedElement.id, type: selectedElement.type });
    console.log('🔍 New data being sent:', newData);
    setFormData(newData);
    // Pass element type explicitly to avoid stale closure issues
    onUpdate(selectedElement.id, newData, selectedElement.type);
    console.log('✅ onUpdate called with:', selectedElement.id, newData, selectedElement.type);
  };

  const handleImageUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to server and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderField = (field, label, type = 'text', icon = Type, options = null) => {
    const Icon = icon;
    return (
      <div key={field} className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-400" />
          {label}
        </label>
        {type === 'select' && options ? (
          <select
            value={formData[field] || options[0]?.value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={formData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all min-h-[100px]"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : type === 'image' ? (
          <div className="space-y-3">
            {formData[field] && (
              <div className="relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <img 
                  src={formData[field]} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload(field)}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <input
            type={type}
            value={formData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
      </div>
    );
  };

  const renderFields = () => {
    switch (selectedElement.type) {
      case 'header':
        return (
          <>
            {renderField('siteName', 'Site Name', 'text', Type)}
            {renderField('logo', 'Logo Image', 'image', ImageIcon)}
          </>
        );

      case 'hero':
        return (
          <>
            {renderField('layout', 'Layout', 'select', Layout, [
              { value: 'left', label: 'Text Left, Image Right' },
              { value: 'right', label: 'Text Right, Image Left' },
              { value: 'center', label: 'Text Center (No Image)' }
            ])}
            {renderField('size', 'Section Size', 'select', Layout, [
              { value: 'full', label: 'Full Height' },
              { value: 'medium', label: 'Medium' },
              { value: 'compact', label: 'Compact' }
            ])}
            {renderField('title', 'Hero Title', 'text', Type)}
            {renderField('subtitle', 'Hero Subtitle', 'textarea', Type)}
            {renderField('primaryButtonText', 'Primary Button Text', 'text', Type)}
            {renderField('primaryButtonLink', 'Primary Button Link', 'url', LinkIcon)}
            {renderField('secondaryButtonText', 'Secondary Button Text', 'text', Type)}
            {renderField('secondaryButtonLink', 'Secondary Button Link', 'url', LinkIcon)}
            {renderField('characterImage', 'Character Image', 'image', ImageIcon)}
          </>
        );

      case 'categories-section':
        return (
          <>
            {renderField('columns', 'Columns Per Row', 'select', Layout, [
              { value: '3', label: '3 Columns' },
              { value: '4', label: '4 Columns' },
              { value: '5', label: '5 Columns' },
              { value: '6', label: '6 Columns' }
            ])}
            {renderField('style', 'Icon Style', 'select', Palette, [
              { value: 'cards', label: 'Cards (Current)' },
              { value: 'circles', label: 'Circles' },
              { value: 'minimal', label: 'Minimal' }
            ])}
          </>
        );

      case 'category':
        return (
          <>
            {renderField('name', 'Category Name', 'text', Type)}
            {renderField('iconImage', 'Category Icon Image', 'image', ImageIcon)}
            <div className="text-xs text-gray-400 -mt-1 mb-2 pl-1">
              Upload a custom icon image, or leave empty to use Lucide icon
            </div>
            {renderField('icon', 'Icon Name (Lucide) - Fallback', 'text', Layout)}
            {renderField('gradient', 'Gradient Classes', 'text', Palette)}
          </>
        );

      case 'vip-banner':
        return (
          <>
            {renderField('size', 'Banner Size', 'select', Layout, [
              { value: 'large', label: 'Large' },
              { value: 'medium', label: 'Medium' },
              { value: 'small', label: 'Small / Compact' }
            ])}
            {renderField('title', 'Banner Title', 'text', Type)}
            {renderField('description', 'Description', 'textarea', Type)}
            {renderField('buttonText', 'Button Text', 'text', Type)}
            {renderField('buttonLink', 'Button Link', 'url', LinkIcon)}
            {renderField('backgroundImage', 'Background Image', 'image', ImageIcon)}
          </>
        );

      case 'streamers-section':
        return (
          <>
            {renderField('columns', 'Columns Per Row', 'select', Layout, [
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' },
              { value: '4', label: '4 Columns' },
              { value: '5', label: '5 Columns' },
              { value: '6', label: '6 Columns' }
            ])}
            {renderField('cardSize', 'Card Size', 'select', Layout, [
              { value: 'large', label: 'Large' },
              { value: 'medium', label: 'Medium' },
              { value: 'small', label: 'Small' }
            ])}
          </>
        );

      case 'streamer-card':
        return (
          <>
            {renderField('name', 'Streamer Name', 'text', Type)}
            {renderField('image', 'Profile Image', 'image', ImageIcon)}
            {renderField('profileUrl', 'Profile URL', 'url', LinkIcon)}
            <div className="text-xs text-gray-400 -mt-1 mb-2 pl-1">
              Link to the streamer's profile page (opens in new tab)
            </div>
            {renderField('viewers', 'Viewer Count', 'text', Eye)}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Live Status
              </label>
              <select
                value={formData.isLive ? 'true' : 'false'}
                onChange={(e) => handleChange('isLive', e.target.value === 'true')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="true">Live</option>
                <option value="false">Offline</option>
              </select>
            </div>
          </>
        );

      case 'features-section':
        return (
          <>
            {renderField('columns', 'Columns Per Row', 'select', Layout, [
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' },
              { value: '4', label: '4 Columns' }
            ])}
            {renderField('style', 'Card Style', 'select', Palette, [
              { value: 'cards', label: 'Cards (Current)' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'icons-only', label: 'Icons Only' }
            ])}
          </>
        );

      case 'feature':
        return (
          <>
            {renderField('title', 'Feature Title', 'text', Type)}
            {renderField('description', 'Description', 'textarea', Type)}
            {renderField('icon', 'Icon Name (Lucide)', 'text', Layout)}
            {renderField('iconImage', 'Custom Icon Image', 'image', ImageIcon)}
            <div className="text-xs text-gray-400 -mt-1 mb-2 pl-1">
              Upload custom icon (overrides Lucide icon)
            </div>
            {renderField('link', 'Link URL', 'url', LinkIcon)}
            <div className="text-xs text-gray-400 -mt-1 mb-2 pl-1">
              Click feature card to redirect to this URL
            </div>
          </>
        );

      case 'download-section':
        return (
          <>
            {renderField('layout', 'Layout', 'select', Layout, [
              { value: 'left', label: 'Phone Left, Text Right' },
              { value: 'right', label: 'Phone Right, Text Left' },
              { value: 'center', label: 'Text Center (No Phone)' }
            ])}
            {renderField('heading', 'Main Heading', 'text', Type)}
            {renderField('subheading', 'Sub Heading', 'text', Type)}
            {renderField('description', 'Description', 'textarea', Type)}
            {renderField('appStoreText', 'App Store Button Text', 'text', Type)}
            {renderField('appStoreLink', 'App Store Link', 'url', LinkIcon)}
            {renderField('playStoreText', 'Google Play Button Text', 'text', Type)}
            {renderField('playStoreLink', 'Play Store Link', 'url', LinkIcon)}
            {renderField('phoneMockup', 'Phone Mockup', 'image', ImageIcon)}
          </>
        );

      case 'text-block':
        return (
          <>
            {renderField('content', 'Text Content', 'textarea', Type)}
            {renderField('alignment', 'Text Alignment', 'select', Layout, [
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' }
            ])}
            {renderField('fontSize', 'Font Size', 'select', Type, [
              { value: 'sm', label: 'Small' },
              { value: 'base', label: 'Base' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
              { value: '2xl', label: '2X Large' }
            ])}
          </>
        );

      case 'footer-link':
        return (
          <>
            {renderField('text', 'Link Text', 'text', Type)}
            {renderField('url', 'Link URL', 'url', LinkIcon)}
          </>
        );

      case 'social-link':
        return (
          <>
            {renderField('platform', 'Platform', 'text', Type)}
            {renderField('url', 'Profile URL', 'url', LinkIcon)}
          </>
        );

      default:
        return (
          <div className="text-gray-400 text-center py-8">
            No editable properties for this element type.
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-[100] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Edit {selectedElement.type}</h3>
            <p className="text-cyan-100 text-sm mt-1">ID: {selectedElement.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {renderFields()}
        </div>

        {/* Actions Footer */}
        <div className="border-t border-gray-800 p-6 space-y-3 bg-gray-900">
          {/* Save Button */}
          <button
            type="button"
            disabled={saveStatus === 'saving'}
            onClick={() => {
              setSaveStatus('saving');
              console.log('💾 Save button clicked!', { id: selectedElement.id, formData, type: selectedElement.type });
              onUpdate(selectedElement.id, formData, selectedElement.type);
              setTimeout(() => {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
              }, 300);
            }}
            className={`w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all font-medium cursor-pointer ${
              saveStatus === 'saved' 
                ? 'bg-green-600 hover:bg-green-700' 
                : saveStatus === 'saving'
                ? 'bg-yellow-600 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800'
            } text-white`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
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

          {/* Delete Button */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this element?')) {
                onDelete(selectedElement.id);
                onClose();
              }
            }}
            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete Element
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PropertiesPanel;
