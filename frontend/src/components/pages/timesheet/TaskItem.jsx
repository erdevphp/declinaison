import React from 'react';
import { FiTrash2, FiGrid } from 'react-icons/fi';

const TaskItem = ({ task, index, onDelete, onUpdate, isReadOnly = false }) => {
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      onUpdate(index, { ...task, duration: newDuration });
    }
  };
  
  const handleNameChange = (e) => {
    onUpdate(index, { ...task, name: e.target.value });
  };
  
  const handleDescriptionChange = (e) => {
    onUpdate(index, { ...task, description: e.target.value });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Drag handle (pour plus tard) */}
        <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <FiGrid className="w-5 h-5" />
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={task.name}
              onChange={handleNameChange}
              placeholder="Nom de la tâche"
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              disabled={isReadOnly}
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Durée:</span>
              <input
                type="number"
                value={task.duration}
                onChange={handleDurationChange}
                step={15}
                min={15}
                className="w-20 px-2 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-primary-500 focus:outline-none"
                disabled={isReadOnly}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">min</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={task.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Description (optionnel)"
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              disabled={isReadOnly}
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Horaire:</span> {task.startTime} → {task.endTime}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Durée:</span> {task.duration} min
            </span>
          </div>
        </div>
        
        {/* Bouton supprimer */}
        {!isReadOnly && (
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;