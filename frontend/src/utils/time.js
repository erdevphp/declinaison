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