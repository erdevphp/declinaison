import React from 'react';
import { motion } from 'framer-motion';
import { timeToMinutes } from '../../../utils/time';

const TaskBlock = ({ task, startHour = 7, endHour = 16, totalWidth = 800, onClick }) => {
  const startMinutes = timeToMinutes(task.startTime);
  const endMinutes = timeToMinutes(task.endTime);
  const dayStartMinutes = timeToMinutes(`${startHour}:00`);
  const dayEndMinutes = timeToMinutes(`${endHour}:00`);
  const totalDayMinutes = dayEndMinutes - dayStartMinutes;
  
  const leftPercent = ((startMinutes - dayStartMinutes) / totalDayMinutes) * 100;
  const widthPercent = ((endMinutes - startMinutes) / totalDayMinutes) * 100;
  
  // Calculer la couleur en fonction du type de tâche
  const bgColor = task.isBreak 
    ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
    : 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700';
  
  const textColor = task.isBreak 
    ? 'text-amber-700 dark:text-amber-300'
    : 'text-primary-700 dark:text-primary-300';
  
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3 }}
      className={`absolute h-full ${bgColor} border-l-4 rounded-r-lg cursor-pointer hover:shadow-lg transition-shadow`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: '0.25rem',
        height: 'calc(100% - 0.5rem)',
      }}
      onClick={() => onClick && onClick(task)}
      title={`${task.name} (${task.startTime} → ${task.endTime})`}
    >
      <div className="absolute inset-0 flex flex-col items-start justify-center px-2 overflow-hidden">
        <span className={`text-xs font-medium truncate ${textColor}`}>
          {task.name}
        </span>
        <span className={`text-xs ${textColor} opacity-75`}>
          {task.startTime} → {task.endTime}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskBlock;