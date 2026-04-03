import { motion } from 'framer-motion';
import { Edit2, GripVertical } from 'lucide-react';

/**
 * EditableElement - Wrapper that makes any element editable in the visual editor
 */
function EditableElement({ 
  id, 
  type, 
  children, 
  isSelected, 
  onClick, 
  className = '',
  isDraggable = false 
}) {
  return (
    <motion.div
      className={`relative group ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id, type);
      }}
      whileHover={{ scale: 1.002 }}
      transition={{ duration: 0.2 }}
    >
      {/* Selection Border */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-4 border-cyan-500 rounded-lg pointer-events-none z-50"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
        />
      )}

      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none ${isSelected ? 'opacity-20' : ''}`} />

      {/* Edit Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-40 flex items-center gap-2">
        {isDraggable && (
          <div className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow-lg">
            <GripVertical className="w-3 h-3" />
            Drag
          </div>
        )}
        <div className="bg-cyan-600 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow-lg">
          <Edit2 className="w-3 h-3" />
          Click to edit
        </div>
      </div>

      {/* Type Label */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-0 bg-cyan-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-lg z-50"
        >
          {type}
        </motion.div>
      )}

      {/* Content */}
      <div className={isSelected ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </motion.div>
  );
}

export default EditableElement;
