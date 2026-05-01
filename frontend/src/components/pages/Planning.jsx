import React, { useState } from 'react';
import TimesheetVertical from './Timesheet/TimesheetVertical';
import toast from 'react-hot-toast';

const Planning = () => {
  const handleSave = (tasks) => {
    console.log('Tâches sauvegardées:', tasks);
    toast.success(`${tasks.length} tâche(s) sauvegardée(s)`);
  };
  
  return (
    <div className="p-6">
      <TimesheetVertical onSave={handleSave} />
    </div>
  );
};

export default Planning;