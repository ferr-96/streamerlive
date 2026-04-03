import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical, Eye, EyeOff, Users as UsersIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function StreamersManager() {
  const [streamers, setStreamers] = useState([
    {
      id: 1,
      name: 'NinjaGamer',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      viewers: 12500,
      isLive: true,
      category: 'Fortnite',
      position: 0
    },
    {
      id: 2,
      name: 'QueenStreamer',
      profileImage: 'https://i.pravatar.cc/150?img=45',
      viewers: 8200,
      isLive: true,
      category: 'Just Chatting',
      position: 1
    },
    {
      id: 3,
      name: 'ProGamer99',
      profileImage: 'https://i.pravatar.cc/150?img=33',
      viewers: 0,
      isLive: false,
      category: 'League of Legends',
      position: 2
    }
  ]);

  const [editingStreamer, setEditingStreamer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    viewers: 0,
    isLive: false,
    category: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setStreamers((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        // Update positions
        return reordered.map((item, index) => ({
          ...item,
          position: index
        }));
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Streamer name is required');
      return;
    }

    if (editingStreamer) {
      setStreamers(prev => prev.map(s =>
        s.id === editingStreamer.id
          ? { ...s, ...formData }
          : s
      ));
      alert('Streamer updated successfully!');
    } else {
      const newStreamer = {
        id: Date.now(),
        ...formData,
        position: streamers.length
      };
      setStreamers(prev => [...prev, newStreamer]);
      alert('Streamer added successfully!');
    }

    resetForm();
  };

  const handleEdit = (streamer) => {
    setEditingStreamer(streamer);
    setFormData({
      name: streamer.name,
      profileImage: streamer.profileImage,
      viewers: streamer.viewers,
      isLive: streamer.isLive,
      category: streamer.category
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this streamer profile?')) return;
    
    setStreamers(prev => prev.filter(s => s.id !== id).map((s, index) => ({
      ...s,
      position: index
    })));
    alert('Streamer deleted successfully');
  };

  const resetForm = () => {
    setEditingStreamer(null);
    setShowForm(false);
    setFormData({
      name: '',
      profileImage: '',
      viewers: 0,
      isLive: false,
      category: ''
    });
  };

  function SortableStreamerCard({ streamer }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: streamer.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 border border-gray-700 hover:border-purple-500/50 transition-all"
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-purple-400 transition-colors"
        >
          <GripVertical className="w-6 h-6" />
        </div>

        {/* Profile Image */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <img
            src={streamer.profileImage || 'https://via.placeholder.com/150'}
            alt={streamer.name}
            className="w-full h-full rounded-full object-cover border-2 border-gray-600"
          />
          {streamer.isLive && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{streamer.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              {streamer.viewers.toLocaleString()} viewers
            </span>
            {streamer.category && (
              <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                {streamer.category}
              </span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {streamer.isLive ? (
            <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
              <Eye className="w-4 h-4" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <EyeOff className="w-4 h-4" />
              Offline
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(streamer)}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(streamer.id)}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Streamers Manager
          </h1>
          <p className="text-gray-400">Manage featured streamer profiles on your landing page</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Streamer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {editingStreamer ? 'Edit Streamer' : 'Add New Streamer'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Streamer Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="NinjaGamer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Fortnite"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
              {formData.profileImage && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Viewer Count</label>
              <input
                type="number"
                name="viewers"
                value={formData.viewers}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="12500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isLive"
                id="isLive"
                checked={formData.isLive}
                onChange={handleInputChange}
                className="w-4 h-4 accent-purple-600"
              />
              <label htmlFor="isLive" className="text-sm font-medium cursor-pointer">
                Currently Live
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                {editingStreamer ? 'Update Streamer' : 'Add Streamer'}
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

      {/* Streamers List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Streamers ({streamers.length})</h2>
          <p className="text-sm text-gray-400">
            Drag and drop to reorder
          </p>
        </div>

        {streamers.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center border-2 border-dashed border-gray-700">
            <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No streamers yet</h3>
            <p className="text-gray-400 mb-6">Add your first featured streamer to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Streamer
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={streamers}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {streamers.map(streamer => (
                  <SortableStreamerCard key={streamer.id} streamer={streamer} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default StreamersManager;
