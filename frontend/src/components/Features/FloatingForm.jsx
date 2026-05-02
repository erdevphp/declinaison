// src/components/FloatingForm/FloatingForm.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const FloatingForm = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen, initialData = null, onSave }) => {
  const boxRef = useRef(null);
  const location = useLocation();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
  });
  
  // Position et drag
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Clés pour localStorage
  const POSITION_KEY = 'floatingForm_position';
  const HAS_BEEN_POSITIONED_KEY = 'floatingForm_hasBeenPositioned';
  const OPEN_KEY = 'floatingForm_isOpen';
  const PAGE_KEY = 'floatingForm_page';

  // 🎯 État interne persistant
  const [internalIsOpen, setInternalIsOpen] = useState(() => {
    try {
      const savedOpen = localStorage.getItem(OPEN_KEY);
      const savedPage = localStorage.getItem(PAGE_KEY);
      // Ne rouvrir que si sauvegardé ET qu'on est sur la même page
      if (savedOpen === 'true' && savedPage === window.location.pathname) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Synchroniser l'état externe avec l'état interne
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  // Sauvegarder l'état d'ouverture dans localStorage
  const saveOpenState = useCallback((open) => {
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify(open));
      if (open) {
        localStorage.setItem(PAGE_KEY, location.pathname);
      } else {
        localStorage.removeItem(PAGE_KEY);
      }
    } catch (e) {
      console.error('Erreur sauvegarde état ouverture', e);
    }
  }, [location.pathname]);

  // Sauvegarder quand l'état change
  useEffect(() => {
    saveOpenState(isOpen);
  }, [isOpen, saveOpenState]);

  // Remplir le formulaire quand on édite une tâche
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        duration: initialData.duration || 60,
      });
    } else if (!isOpen) {
      // Reset quand on ferme
      setFormData({ name: '', description: '', duration: 60 });
    }
  }, [initialData, isOpen]);

  // Centrer le formulaire
  const centerBox = useCallback(() => {
    if (!boxRef.current || !isOpen) return;
    
    requestAnimationFrame(() => {
      if (!boxRef.current) return;
      const box = boxRef.current;
      const x = (window.innerWidth - box.offsetWidth) / 2;
      const y = (window.innerHeight - box.offsetHeight) / 2;
      setPos({ x: Math.max(0, x), y: Math.max(0, y) });
    });
  }, [isOpen]);

  // Sauvegarder position
  const savePosition = useCallback((newPos) => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(newPos));
    localStorage.setItem(HAS_BEEN_POSITIONED_KEY, 'true');
  }, []);

  // Charger la position sauvegardée
  const loadSavedPosition = useCallback(() => {
    try {
      const hasBeenPositioned = localStorage.getItem(HAS_BEEN_POSITIONED_KEY);
      const saved = localStorage.getItem(POSITION_KEY);
      
      if (hasBeenPositioned === 'true' && saved) {
        const { x, y } = JSON.parse(saved);
        if (boxRef.current) {
          const maxX = window.innerWidth - boxRef.current.offsetWidth;
          const maxY = window.innerHeight - boxRef.current.offsetHeight;
          return {
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY)
          };
        }
        return { x, y };
      }
    } catch (e) {
      console.error('Erreur chargement position', e);
    }
    return null;
  }, []);

  // À l'ouverture : charger position sauvegardée ou centrer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const savedPos = loadSavedPosition();
      
      if (savedPos) {
        setPos(savedPos);
      } else {
        centerBox();
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [isOpen, loadSavedPosition, centerBox]);

  // Sauvegarder la position après drag
  useEffect(() => {
    if (!dragging && (pos.x !== 0 || pos.y !== 0)) {
      savePosition(pos);
    }
  }, [pos, dragging, savePosition]);

  // Réagir aux changements de taille de fenêtre
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (!boxRef.current) return;
      
      const box = boxRef.current;
      const maxX = window.innerWidth - box.offsetWidth;
      const maxY = window.innerHeight - box.offsetHeight;
      
      setPos(prev => {
        const newX = Math.min(Math.max(0, prev.x), maxX);
        const newY = Math.min(Math.max(0, prev.y), maxY);
        
        if (newX !== prev.x || newY !== prev.y) {
          savePosition({ x: newX, y: newY });
        }
        
        return { x: newX, y: newY };
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(document.body);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [isOpen, savePosition]);

  // Drag & drop
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
    
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;
    
    if (boxRef.current) {
      const maxX = window.innerWidth - boxRef.current.offsetWidth;
      const maxY = window.innerHeight - boxRef.current.offsetHeight;
      newX = Math.min(Math.max(0, newX), maxX);
      newY = Math.min(Math.max(0, newY), maxY);
    }
    
    setPos({ x: newX, y: newY });
  };

  const stopDrag = () => setDragging(false);

  const resetPosition = () => {
    localStorage.removeItem(POSITION_KEY);
    localStorage.removeItem(HAS_BEEN_POSITIONED_KEY);
    centerBox();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setIsOpen(false);
  };

  const isEdit = !!initialData;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={boxRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onMouseDown={startDrag}
          onMouseMove={duringDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="fixed bg-white rounded-2xl dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            width: '24rem',
            maxWidth: 'calc(100vw - 2rem)',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div 
              className="flex items-center justify-between mb-6 cursor-default"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isEdit ? 'Modifiez les détails de votre tâche' : 'Ajoutez une nouvelle tâche à votre planning'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetPosition();
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
                  title="Réinitialiser la position"
                >
                  ↺
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom de la tâche <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Ex: Développement API"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="3"
                    placeholder="Description détaillée de la tâche..."
                  />
                </div>

                {/* Durée */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    step={15}
                    min={15}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    La tâche suivante commencera automatiquement à la fin de celle-ci
                  </p>
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
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-all bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {isEdit ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingForm;