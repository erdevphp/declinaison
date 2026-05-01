import React from 'react';
import TaskBlock from './TaskBlock';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const TaskRow = ({ task, index, onEdit, onDelete, startHour = 7, endHour = 16, totalWidth = 800 }) => {
  return (
    <div className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Colonne info tâche */}
      <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {task.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {task.duration} min
            </p>
            {task.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                {task.description}
              </p>
            )}
          </div>
          {!task.isBreak && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FiEdit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Timeline */}
      <div className="flex-1 relative min-h-[4rem]">
        <div className="absolute inset-0 flex">
          {/* Grille verticale des heures */}
          <div className="flex-1 relative">
            {!task.isBreak && (
              <TaskBlock
                task={task}
                startHour={startHour}
                endHour={endHour}
                totalWidth={totalWidth}
                onClick={() => onEdit(task)}
              />
            )}
            {task.isBreak && (
              <TaskBlock
                task={task}
                startHour={startHour}
                endHour={endHour}
                totalWidth={totalWidth}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;