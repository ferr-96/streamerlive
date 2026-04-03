import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Filter, Image as ImageIcon, Video, FileImage } from 'lucide-react';

function MediaLibrary() {
  const [media, setMedia] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      type: 'image',
      name: 'banner-gaming.jpg',
      size: '1.2 MB',
      uploadedAt: '2024-03-15T10:30:00'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
      type: 'image',
      name: 'streamer-hero.jpg',
      size: '890 KB',
      uploadedAt: '2024-03-14T15:20:00'
    },
    {
      id: 3,
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      type: 'video',
      name: 'promo-video.mp4',
      size: '5.4 MB',
      uploadedAt: '2024-03-13T09:15:00'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const filteredMedia = media.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Validate file
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`${file.name} is not a valid image or video file`);
          continue;
        }

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large (max 10MB)`);
          continue;
        }

        // In a real app, upload to API
        await new Promise(resolve => setTimeout(resolve, 500));

        const newMedia = {
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString()
        };

        setMedia(prev => [newMedia, ...prev]);
      }

      alert('Files uploaded successfully!');
      e.target.value = ''; // Reset input
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload some files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this media file? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real app, delete from API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMedia(prev => prev.filter(item => item.id !== id));
      alert('Media deleted successfully');
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media');
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const FilterButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => setFilter(value)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${filter === value
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const MediaCard = ({ item }) => {
    const isImage = item.type === 'image';
    const isVideo = item.type === 'video';
    const isCopied = copiedId === item.id;

    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all group">
        {/* Preview */}
        <div className="aspect-video bg-gray-900 flex items-center justify-center overflow-hidden relative">
          {isImage ? (
            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
          ) : isVideo ? (
            <video src={item.url} className="w-full h-full object-cover" controls />
          ) : (
            <FileImage className="w-12 h-12 text-gray-600" />
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => handleCopyUrl(item.url, item.id)}
              className={`
                p-3 rounded-lg transition-all
                ${isCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                }
              `}
              title="Copy URL"
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-sm truncate" title={item.name}>
              {item.name}
            </h3>
            <span className={`
              px-2 py-1 rounded text-xs font-medium flex-shrink-0
              ${isImage ? 'bg-blue-900/50 text-blue-300' : 'bg-purple-900/50 text-purple-300'}
            `}>
              {item.type.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{item.size}</span>
            <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Media Library
          </h1>
          <p className="text-gray-400">Upload and manage your images, videos, and GIFs</p>
        </div>
        <label
          htmlFor="media-upload"
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-all
            ${uploading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
            }
          `}
        >
          <Upload className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Upload Media'}
        </label>
        <input
          id="media-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Stats & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          <FilterButton value="all" label="All" icon={FileImage} />
          <FilterButton value="image" label="Images" icon={ImageIcon} />
          <FilterButton value="video" label="Videos" icon={Video} />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-400">Total Files: </span>
          <span className="font-bold text-white">{media.length}</span>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-gray-400">Showing: </span>
          <span className="font-bold text-white">{filteredMedia.length}</span>
        </div>
        <div className="text-sm text-gray-400">
          {filter !== 'all' && `Filtered by ${filter}s`}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-700">
          <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No media files yet</h3>
          <p className="text-gray-400 mb-6">
            Upload images, videos, or GIFs to get started
          </p>
          <label
            htmlFor="media-upload-empty"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Your First File
          </label>
          <input
            id="media-upload-empty"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-blue-300">Upload Guidelines</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Maximum file size: 10MB</li>
          <li>• Supported formats: JPG, PNG, GIF, MP4, WEBM</li>
          <li>• Recommended image size: 1920x1080px for banners</li>
          <li>• Multiple files can be uploaded at once</li>
        </ul>
      </div>
    </div>
  );
}

export default MediaLibrary;
