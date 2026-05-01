import React, { useState } from "react"
import FloatingForm from "../../Features/FloatingForm"

const Timesheet = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="text-gray-900 dark:text-white">
            <div className="flex justify-between items-center">
                <h1 className="mb-4 text-2xl">Timesheet d'aujourd'hui</h1>
                <div>
                    <button
                        className="bg-green-500 w-full rounded p-2 text-amber-50"
                        onClick={() => setIsOpen(true)}
                    >
                        Nouvelle tâche
                    </button>
                </div>
            </div>
            <div className="">
                <FloatingForm isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    )
}

export default Timesheet