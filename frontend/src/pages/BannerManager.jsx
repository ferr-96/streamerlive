import { useState, useEffect } from 'react';
import { bannersAPI } from '../services/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    videoUrl: '',
    gifUrl: '',
    mediaType: 'image',
    width: '',
    height: '',
    position: 0,
    effect: 'none',
    link: '',
    active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getAll();
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      alert('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      if (editingBanner) {
        await bannersAPI.update(editingBanner.id, formData);
        alert('Banner updated successfully');
      } else {
        await bannersAPI.create(formData);
        alert('Banner created successfully');
      }
      
      resetForm();
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner:', err);
      alert('Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      imageUrl: banner.imageUrl || '',
      videoUrl: banner.videoUrl || '',
      gifUrl: banner.gifUrl || '',
      mediaType: banner.mediaType || 'image',
      width: banner.width || '',
      height: banner.height || '',
      position: banner.position || 0,
      effect: banner.effect || 'none',
      link: banner.link || '',
      active: banner.active === 1 || banner.active === true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await bannersAPI.delete(id);
      alert('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setShowForm(false);
    setFormData({
      title: '',
      imageUrl: '',
      videoUrl: '',
      gifUrl: '',
      mediaType: 'image',
      width: '',
      height: '',
      position: 0,
      effect: 'none',
      link: '',
      active: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Banner Manager</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>

        {/* Banner Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Media Type</label>
                <select
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              {/* Image URL */}
              {(formData.mediaType === 'image' || formData.mediaType === 'gif') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formData.mediaType === 'gif' ? 'GIF URL' : 'Image URL'}
                  </label>
                  <input
                    type="url"
                    name={formData.mediaType === 'gif' ? 'gifUrl' : 'imageUrl'}
                    value={formData.mediaType === 'gif' ? formData.gifUrl : formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Video URL */}
              {formData.mediaType === 'video' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              )}

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Link URL
                  <span className="text-gray-400 text-xs ml-2">(Optional - Opens in new tab when clicked)</span>
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/destination"
                />
              </div>

              {/* Width & Height */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width (px)</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="1920"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="1080"
                  />
                </div>
              </div>

              {/* Position & Effect */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <input
                    type="number"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Effect</label>
                  <select
                    name="effect"
                    value={formData.effect}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Active (Show on landing page)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold mb-2">All Banners ({banners.length})</h2>
          
          {banners.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
              No banners yet. Create your first banner to get started!
            </div>
          ) : (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-gray-800 rounded-lg p-6 flex items-center gap-6"
              >
                {/* Thumbnail */}
                <div className="w-32 h-20 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  {banner.mediaType === 'video' && banner.videoUrl ? (
                    <video src={banner.videoUrl} className="w-full h-full object-cover" />
                  ) : banner.mediaType === 'gif' && banner.gifUrl ? (
                    <img src={banner.gifUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      No media
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{banner.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                    <span className="bg-gray-700 px-2 py-1 rounded">{banner.mediaType}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded">Position: {banner.position}</span>
                    {banner.link && (
                      <span className="bg-blue-900/50 px-2 py-1 rounded text-blue-300">
                        🔗 {new URL(banner.link).hostname}
                      </span>
                    )}
                    {banner.active ? (
                      <span className="bg-green-900/50 px-2 py-1 rounded text-green-300 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="bg-red-900/50 px-2 py-1 rounded text-red-300 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BannerManager;
