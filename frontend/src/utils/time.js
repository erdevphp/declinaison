export const formatWithZero = (number) => {
    return (number < 10) ? `0${number}` : number;
}

// Cette fonction permet le formatage d'une durée donnée en HeureMinute ou en Minute
export const timeToHourMinutes = (duration) => {
    const hour = Math.floor(duration / 60);  
    const minutes = duration % 60 !== 0 ? duration % 60 : 0;
    return (hour > 0) ? `${formatWithZero(hour)}h${formatWithZero(minutes)}` : `${formatWithZero(minutes)}min`;
}

// Cette fonction prend en paramètre un Time en format H:i et retourne une minute
export const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Cette fonction fait l'inverse de la fonction timeToMinutes
export const minutesToTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Cette fonction retourne le total venant de l'H:i en Minutes dans une journée
// Attention il utilise mes variables spécifique comme task.startAt et task.endAt
export const totalMinutesInDay = (tasks) => {
    return tasks.reduce((total, task) => {
        const start = task.startAt.split(':');
        const end = task.endAt.split(':');
        const duration = (parseInt(end[0]) * 60 + parseInt(end[1])) - (parseInt(start[0]) * 60 + parseInt(start[1]));
        return total + duration;
    }, 0)
}


/**
 * Ajoute des minutes à une heure
 */
export const addMinutesToTime = (timeStr, minutesToAdd) => {
  const totalMinutes = timeToMinutes(timeStr) + minutesToAdd;
  return minutesToTime(totalMinutes);
};

/**
 * Calcule la durée entre deux heures (en minutes)
 */
export const getDuration = (startTime, endTime) => {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
};

/**
 * Calcule le temps total d'une liste de tâches
 */
export const calculateTotalMinutes = (tasks) => {
  return tasks.reduce((total, task) => total + task.duration, 0);
};

/**
 * Vérifie si l'heure est pendant la pause déjeuner
 */
export const isLunchTime = (time) => {
  const minutes = timeToMinutes(time);
  const lunchStart = timeToMinutes('12:00');
  const lunchEnd = timeToMinutes('13:00');
  return minutes >= lunchStart && minutes < lunchEnd;
};

// Ajoute ces fonctions

/**
 * Calcule la position en pixels d'une heure dans une timeline
 */
export const getTimePosition = (time, startHour = 7, endHour = 16, totalPixels = 800) => {
  const startMinutes = timeToMinutes(`${startHour}:00`);
  const endMinutes = timeToMinutes(`${endHour}:00`);
  const totalMinutes = endMinutes - startMinutes;
  const currentMinutes = timeToMinutes(time);
  
  return ((currentMinutes - startMinutes) / totalMinutes) * totalPixels;
};

/**
 * Calcule la largeur (en pixels) d'une durée
 */
export const getDurationWidth = (durationMinutes, startHour = 7, endHour = 16, totalPixels = 800) => {
  const startMinutes = timeToMinutes(`${startHour}:00`);
  const endMinutes = timeToMinutes(`${endHour}:00`);
  const totalMinutes = endMinutes - startMinutes;
  
  return (durationMinutes / totalMinutes) * totalPixels;
};

/**
 * Génère les heures pour l'en-tête (ex: 07:00, 08:00, ...)
 */
export const generateHourLabels = (startHour = 7, endHour = 16) => {
  const labels = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    labels.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return labels;
};