import React from 'react';
import { minutesToTime, timeToMinutes } from '../../../utils/time';

const TimeBar = ({ tasks, startHour = 7, endHour = 16, lunchStart = '12:00', lunchEnd = '13:00' }) => {
  const startMinutes = timeToMinutes(`${startHour}:00`);
  const endMinutes = timeToMinutes(`${endHour}:00`);
  const totalDuration = endMinutes - startMinutes;
  
  // Calculer les segments occupés par les tâches
  const getOccupiedSegments = () => {
    const segments = [];
    
    tasks.forEach((task) => {
      if (task.isBreak) return;
      const start = timeToMinutes(task.startTime);
      const end = timeToMinutes(task.endTime);
      segments.push({ start, end, color: 'bg-primary-500', task: task });
    });
    
    // Ajouter la pause déjeuner comme segment spécial
    const lunchStartMin = timeToMinutes(lunchStart);
    const lunchEndMin = timeToMinutes(lunchEnd);
    segments.push({ start: lunchStartMin, end: lunchEndMin, color: 'bg-amber-400', isBreak: true, label: '🍽️ Pause' });
    
    return segments.sort((a, b) => a.start - b.start);
  };
  
  const segments = getOccupiedSegments();
  
  // Générer les heures pour l'affichage
  const hourLabels = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    hourLabels.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  // Calculer la position et largeur d'un segment
  const getSegmentStyle = (start, end) => {
    const leftPercent = ((start - startMinutes) / totalDuration) * 100;
    const widthPercent = ((end - start) / totalDuration) * 100;
    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
        {hourLabels.map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
      
      <div className="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Ligne de fond grise */}
        <div className="absolute inset-0"></div>
        
        {/* Segments occupés */}
        {segments.map((segment, idx) => (
          <div
            key={idx}
            className={`absolute h-full ${segment.color} ${segment.isBreak ? 'opacity-80' : 'opacity-90'} transition-all`}
            style={getSegmentStyle(segment.start, segment.end)}
            title={segment.label || segment.task?.name}
          >
            {segment.label && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                {segment.label}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Légende */}
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Tâches</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Pause déjeuner</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Libre</span>
        </div>
      </div>
    </div>
  );
};

export default TimeBar;