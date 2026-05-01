import React from 'react';

const generateHourLabels = (startHour = 7, endHour = 16) => {
  const labels = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    labels.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return labels;
};

const TimeHeader = ({ startHour = 7, endHour = 16, totalWidth = 800 }) => {
  const hourLabels = generateHourLabels(startHour, endHour);
  const columnWidth = totalWidth / (endHour - startHour);
  
  return (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        {/* Colonne vide pour alignement avec les noms des tâches */}
        <div className="w-48 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 font-medium text-gray-500 dark:text-gray-400">
          Tâches
        </div>
        
        {/* Grille des heures */}
        <div className="flex flex-1 min-w-0">
          {hourLabels.map((hour, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 text-center text-xs text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700"
              style={{ width: columnWidth }}
            >
              <span className="block py-2">{hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeHeader;