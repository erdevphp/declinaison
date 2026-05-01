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

  // Drag & drop
  useEffect(() => {
    const centerBox = () => {
      if (!boxRef.current) return;
      const box = boxRef.current;
      const x = (window.innerWidth - box.offsetWidth) / 2;
      const y = (window.innerHeight - box.offsetHeight) / 2;
      setPos({ x, y });
      console.log(y, x);
      
    };

    centerBox();
    window.addEventListener('resize', centerBox);
    return () => window.removeEventListener('resize', centerBox);
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
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const stopDrag = () => setDragging(false);

  const isEdit = false
  const loading = false

  return (
    <div
      ref={boxRef}
      onMouseDown={startDrag}
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      className={`fixed bg-white rounded-2xl dark:bg-gray-900 shadow-2xl border border-gray-200 z-90 ${dragging ? 'cursor-grabbing' : 'cursor-move'}`}
      style={{
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: '24rem',
        maxWidth: 'calc(100vw - 2rem)',
        display: `${isOpen ? '' : 'none'}`,
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <p className="text-sm mt-1">
              {isEdit ? 'Modifiez les détails de votre tâche' : 'Ajoutez une nouvelle tâche à votre planning'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 text-white-600 rounded-lg hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-700"
          >
            <FiX />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('Submit')
        }}>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la tâche <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-color`}
                placeholder="Ex: Développement API"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows="3"
                placeholder="Description détaillée de la tâche..."
              />
            </div>

            {/* Heures */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Début <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2.5 bg-gray-300 cursor-not-allowed text-purple-600 font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  disabled={true}
                  style={{ opacity: 0.5 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all bg-sky-800 text-amber-50`}
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default FloatingForm;