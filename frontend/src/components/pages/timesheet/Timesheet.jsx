import React, { useState } from "react"
import FloatingForm from "../../Features/FloatingForm"
import usePersistentState from "../../../hooks/usePersistentState";

const Timesheet = () => {
    // Utiliser le hook personnalisé au lieu de useState
    const [isFormOpen, setIsFormOpen] = usePersistentState('floatingForm_isOpen', false);

    // Optionnel : sauvegarder aussi le chemin de la page
    const [lastPage, setLastPage] = usePersistentState('floatingForm_lastPage', window.location.pathname);

    // Optionnel : vérifier si on est sur la bonne page pour rouvrir
    const currentPath = window.location.pathname;
    const shouldShowForm = isFormOpen && lastPage === currentPath;

    // Quand on ferme le formulaire, on efface la page associée
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setLastPage(null);
    };

    // Quand on ouvre le formulaire, on sauvegarde la page actuelle
    const handleOpenForm = () => {
        setIsFormOpen(true);
        setLastPage(currentPath);
    };
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="text-gray-900 dark:text-white">
            <div className="flex justify-between items-center">
                <h1 className="mb-4 text-2xl">Timesheet d'aujourd'hui</h1>
                <div>
                    <button
                        className="bg-green-500 w-full rounded p-2 text-amber-50"
                        onClick={handleOpenForm}
                    >
                        Nouvelle tâche
                    </button>
                </div>
            </div>
            <div className="">
                <FloatingForm isOpen={shouldShowForm} setIsOpen={(open) => {
                    if (!open) handleCloseForm();
                    else handleOpenForm();
                }} />
            </div>
        </div>
    )
}

export default Timesheet