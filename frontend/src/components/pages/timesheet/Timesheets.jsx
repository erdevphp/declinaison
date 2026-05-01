import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSave, FiAlertCircle } from 'react-icons/fi';
import TaskItem from './TaskItem';
import TimeBar from './TimeBar';
import { minutesToTime, timeToMinutes, addMinutesToTime, calculateTotalMinutes } from '../../../utils/time';

// Configuration
const START_DAY = '07:00';
const END_DAY = '16:00';
const LUNCH_START = '12:00';
const LUNCH_END = '13:00';
const LUNCH_DURATION = timeToMinutes(LUNCH_END) - timeToMinutes(LUNCH_START);

const Timesheets = ({ initialTasks = [], onSave, readOnly = false }) => {
  const [tasks, setTasks] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [availableMinutes, setAvailableMinutes] = useState(0);
  const [isOverflow, setIsOverflow] = useState(false);
  
  // Recalculer toutes les heures des tâches en fonction de leur durée
  const recalculateTimes = useCallback((tasksList) => {
    let currentTime = START_DAY;
    const updatedTasks = [];
    
    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];
      
      // Gérer le passage de la pause déjeuner
      const currentMinutes = timeToMinutes(currentTime);
      const lunchStartMinutes = timeToMinutes(LUNCH_START);
      const lunchEndMinutes = timeToMinutes(LUNCH_END);
      
      if (currentMinutes < lunchStartMinutes && currentMinutes + task.duration > lunchStartMinutes) {
        // La tâche empiète sur la pause
        currentTime = LUNCH_END;
      }
      
      const startTime = currentTime;
      const endTime = addMinutesToTime(currentTime, task.duration);
      
      updatedTasks.push({
        ...task,
        id: task.id || crypto.randomUUID(),
        startTime,
        endTime,
      });
      
      currentTime = endTime;
    }
    
    return updatedTasks;
  }, []);
  
  // Recalculer les totaux et vérifier les débordements
  const updateStats = useCallback((tasksList) => {
    const total = calculateTotalMinutes(tasksList);
    const dayStart = timeToMinutes(START_DAY);
    const dayEnd = timeToMinutes(END_DAY);
    const available = (dayEnd - dayStart) - LUNCH_DURATION;
    
    setTotalMinutes(total);
    setAvailableMinutes(available);
    setIsOverflow(total > available);
  }, []);
  
  // Mettre à jour les tâches et tout recalculer
  const updateTasks = useCallback((newTasks) => {
    const tasksWithTimes = recalculateTimes(newTasks);
    setTasks(tasksWithTimes);
    updateStats(tasksWithTimes);
  }, [recalculateTimes, updateStats]);
  
  // Initialisation
  useEffect(() => {
    if (initialTasks.length > 0) {
      updateTasks(initialTasks);
    } else {
      // Tâche par défaut
      updateTasks([
        { name: 'Nouvelle tâche', description: '', duration: 60 },
      ]);
    }
  }, []);
  
  // Ajouter une tâche
  const addTask = () => {
    const newTasks = [
      ...tasks,
      { name: 'Nouvelle tâche', description: '', duration: 60 },
    ];
    updateTasks(newTasks);
  };
  
  // Supprimer une tâche
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks);
  };
  
  // Mettre à jour une tâche
  const updateTask = (index, updatedTask) => {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    updateTasks(newTasks);
  };
  
  // Sauvegarder
  const handleSave = () => {
    if (onSave) {
      onSave(tasks);
    }
  };
  
  // Formater la durée totale
  const formatTotalTime = () => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h${mins > 0 ? `${mins}` : ''}`;
  };
  
  const formatAvailableTime = () => {
    const hours = Math.floor(availableMinutes / 60);
    const mins = availableMinutes % 60;
    return `${hours}h${mins > 0 ? `${mins}` : ''}`;
  };
  
  const remainingMinutes = availableMinutes - totalMinutes;
  const formatRemainingTime = () => {
    if (remainingMinutes < 0) return 'Dépassement';
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `${hours}h${mins > 0 ? `${mins}` : ''}`;
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête avec stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Planning journalier</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {START_DAY} → {END_DAY} (pause déjeuner {LUNCH_START} → {LUNCH_END})
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Temps total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTotalTime()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Temps restant</p>
            <p className={`text-lg font-bold ${remainingMinutes < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {formatRemainingTime()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Disponible</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatAvailableTime()}</p>
          </div>
        </div>
      </div>
      
      {/* Barre de temps visuelle */}
      <TimeBar tasks={tasks} />
      
      {/* Alerte dépassement */}
      {isOverflow && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <FiAlertCircle className="w-5 h-5" />
          <span className="text-sm">
            ⚠️ Dépassement du temps de travail ! Temps total ({formatTotalTime()}) &gt; temps disponible ({formatAvailableTime()})
          </span>
        </div>
      )}
      
      {/* Liste des tâches */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id || index}
            task={task}
            index={index}
            onDelete={deleteTask}
            onUpdate={updateTask}
            isReadOnly={readOnly}
          />
        ))}
      </div>
      
      {/* Boutons actions */}
      {!readOnly && (
        <div className="flex gap-3">
          <button
            onClick={addTask}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Ajouter une tâche
          </button>
          
          <button
            onClick={handleSave}
            disabled={isOverflow}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isOverflow
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            <FiSave className="w-4 h-4" />
            Sauvegarder la journée
          </button>
        </div>
      )}
    </div>
  );
};

export default Timesheets;