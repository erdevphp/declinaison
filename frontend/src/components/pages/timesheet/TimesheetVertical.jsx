import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSave, FiAlertCircle, FiClock } from 'react-icons/fi';
import TimeHeader from './TimeHeader';
import TaskRow from './TaskRow';
import TimeBar from './TimeBar';
import FloatingForm from '../../Features/FloatingForm';
import { minutesToTime, addMinutesToTime, calculateTotalMinutes, timeToMinutes } from '../../../utils/time';
import toast from 'react-hot-toast';

// Configuration
const START_DAY = '07:00';
const END_DAY = '16:00';
const LUNCH_START = '12:00';
const LUNCH_END = '13:00';
const LUNCH_DURATION = timeToMinutes(LUNCH_END) - timeToMinutes(LUNCH_START);
const TOTAL_WIDTH = 800; // px pour la timeline

const TimesheetVertical = ({ initialTasks = [], onSave, readOnly = false }) => {

  // Quand on ouvre le formulaire, on sauvegarde la page actuelle
  const handleOpenForm = () => {
    setIsFormOpen(true);
    setLastPage(currentPath);
  };


  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [availableMinutes, setAvailableMinutes] = useState(0);
  const [isOverflow, setIsOverflow] = useState(false);

  // Recalculer toutes les heures des tâches
  const recalculateTimes = useCallback((tasksList) => {
    let currentTime = START_DAY;
    const updatedTasks = [];
    const lunchStartMinutes = timeToMinutes(LUNCH_START);
    const lunchEndMinutes = timeToMinutes(LUNCH_END);

    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];

      // Gérer la pause déjeuner
      let currentMinutes = timeToMinutes(currentTime);
      if (currentMinutes < lunchStartMinutes && currentMinutes + task.duration > lunchStartMinutes) {
        // Ajouter automatiquement la pause
        if (updatedTasks[updatedTasks.length - 1]?.isBreak !== true) {
          updatedTasks.push({
            id: 'lunch-break',
            name: '🍽️ Pause déjeuner',
            description: 'Pause obligatoire',
            duration: LUNCH_DURATION,
            startTime: LUNCH_START,
            endTime: LUNCH_END,
            isBreak: true,
            isEditable: false,
          });
        }
        currentTime = LUNCH_END;
        currentMinutes = timeToMinutes(currentTime);
      }

      // Ne pas ajouter de pause si c'est déjà une pause
      if (task.isBreak) {
        updatedTasks.push(task);
        currentTime = task.endTime;
        continue;
      }

      const startTime = currentTime;
      const endTime = addMinutesToTime(currentTime, task.duration);

      updatedTasks.push({
        ...task,
        id: task.id || crypto.randomUUID(),
        startTime,
        endTime,
        isBreak: false,
      });

      currentTime = endTime;
    }

    return updatedTasks;
  }, []);

  // Mettre à jour les statistiques
  const updateStats = useCallback((tasksList) => {
    const realTasks = tasksList.filter(t => !t.isBreak);
    const total = calculateTotalMinutes(realTasks);
    const dayStart = timeToMinutes(START_DAY);
    const dayEnd = timeToMinutes(END_DAY);
    const available = (dayEnd - dayStart) - LUNCH_DURATION;

    setTotalMinutes(total);
    setAvailableMinutes(available);
    setIsOverflow(total > available);
  }, []);

  // Mettre à jour toutes les tâches
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
      updateTasks([]);
    }
  }, []);

  // Ajouter une tâche via le formulaire
  const addTask = (taskData) => {
    const newTasks = [
      ...tasks.filter(t => !t.isBreak),
      {
        name: taskData.name,
        description: taskData.description || '',
        duration: taskData.duration,
      },
    ];
    updateTasks(newTasks);
    setIsFormOpen(false);
    toast.success('Tâche ajoutée');
  };

  // Modifier une tâche
  const editTask = (taskData) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === editingTask.id && !t.isBreak) {
        return {
          ...t,
          name: taskData.name,
          description: taskData.description || '',
          duration: taskData.duration,
        };
      }
      return t;
    });
    updateTasks(updatedTasks);
    setEditingTask(null);
    setIsFormOpen(false);
    toast.success('Tâche modifiée');
  };

  // Supprimer une tâche
  const deleteTask = (index) => {
    const realTasks = tasks.filter((t, i) => i !== index && !t.isBreak);
    updateTasks(realTasks);
    toast.success('Tâche supprimée');
  };

  // Ouvrir formulaire pour modification
  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Sauvegarder
  const handleSave = () => {
    const tasksToSave = tasks.filter(t => !t.isBreak);
    onSave(tasksToSave);
    toast.success('Planning sauvegardé');
  };

  // Formatage
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

  return (
    <div className="space-y-4">
      {/* En-tête avec stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiClock className="w-5 h-5 text-primary-500" />
            Planning journalier
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {START_DAY} → {END_DAY} (pause {LUNCH_START} → {LUNCH_END})
          </p>
        </div>

        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Temps total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTotalTime()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Temps restant</p>
            <p className={`text-xl font-bold ${remainingMinutes < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {remainingMinutes < 0 ? 'Dépassement' : `${Math.floor(remainingMinutes / 60)}h${remainingMinutes % 60}`}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Capacité</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatAvailableTime()}</p>
          </div>
        </div>
      </div>

      {/* Barre horizontale (jauge) */}
      <TimeBar tasks={tasks} />

      {/* Timeline verticale */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div style={{ minWidth: TOTAL_WIDTH + 192 }}> {/* 192 = w-48 (12rem) */}
          <TimeHeader startHour={7} endHour={16} totalWidth={TOTAL_WIDTH} />

          {tasks.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune tâche pour le moment. Cliquez sur "Ajouter" pour commencer.
            </div>
          )}

          {tasks.map((task, idx) => (
            <TaskRow
              key={task.id || idx}
              task={task}
              index={idx}
              onEdit={openEditForm}
              onDelete={deleteTask}
              startHour={7}
              endHour={16}
              totalWidth={TOTAL_WIDTH}
            />
          ))}
        </div>
      </div>

      {/* Alerte dépassement */}
      {isOverflow && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <FiAlertCircle className="w-5 h-5" />
          <span className="text-sm">
            Dépassement du temps de travail ! Réduisez la durée des tâches.
          </span>
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            handleOpenForm()
            setEditingTask(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Ajouter une tâche
        </button>

        <button
          onClick={handleSave}
          disabled={isOverflow}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isOverflow
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
            : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
        >
          <FiSave className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>

      {/* Floating Form */}
      <FloatingForm
        initialData={editingTask}
        onSave={editingTask ? editTask : addTask}
      />
    </div>
  );
};

export default TimesheetVertical;