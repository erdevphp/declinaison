import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { minutesToTime, timeToHourMinutes, timeToMinutes } from '../../utils/time';

const FloatingForm = ({ isOpen, setIsOpen }) => {
  const boxRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Position initiale : à droite avec une marge de 1rem (16px)
  useEffect(() => {
    const setInitialPosition = () => {
      if (!boxRef.current) return;
      const box = boxRef.current;
      const marginRight = 16; // 1rem = 16px
      const x = window.innerWidth - box.offsetWidth - marginRight;
      const y = (window.innerHeight - box.offsetHeight) / 2; // centrage vertical
      setPos({ x, y });
    };

    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);
    return () => window.removeEventListener('resize', setInitialPosition);
  }, []);

  const startDrag = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
      return;
    }
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const duringDrag = (e) => {
    if (!dragging) return;
    // Calcul de la nouvelle position avec limites (optionnel)
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;
    
    // Optionnel : empêcher de sortir de l'écran
    if (boxRef.current) {
      const maxX = window.innerWidth - boxRef.current.offsetWidth;
      const maxY = window.innerHeight - boxRef.current.offsetHeight;
      newX = Math.min(Math.max(0, newX), maxX);
      newY = Math.min(Math.max(0, newY), maxY);
    }
    
    setPos({ x: newX, y: newY });
  };

  const stopDrag = () => setDragging(false);

  const isEdit = false;
  const loading = false;

  return (
    <div
      ref={boxRef}
      onMouseDown={startDrag}
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      className={`fixed bg-white rounded-2xl dark:bg-gray-900 shadow-2xl border border-gray-200 z-50 ${
        dragging ? 'cursor-grabbing' : 'cursor-move'
      }`}
      style={{
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: '24rem',
        maxWidth: 'calc(100vw - 2rem)',
        display: isOpen ? 'block' : 'none',
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEdit ? 'Modifiez les détails de votre tâche' : 'Ajoutez une nouvelle tâche à votre planning'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('Submit');
        }}>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la tâche <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Ex: Développement API"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Description détaillée de la tâche..."
              />
            </div>

            {/* Heures */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Début <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-400 font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={true}
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all bg-sky-800 text-amber-50 dark:bg-sky-700 hover:bg-sky-900 dark:hover:bg-sky-600"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FloatingForm;