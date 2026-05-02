import { useEffect, useState } from "react"
import api from "../../../services/api"
import { employeeService } from "../../../services/employeeService"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


const EmployeeList = () => {
    const [employees, setEmployees] = useState([])
    const [error, setError] = useState('')

    const getEmployeesList = async (e) => {
        setError('')
        try {
            const data = await employeeService.lists()
            setEmployees(data)
            console.log(data);

        } catch (err) {
            const message = err.response?.data?.error || 'Erreur de connexion'
            setError(message)
        }
    }
    useEffect(() => {
        getEmployeesList()
    }, [])
    return (
        <div className="text-gray-900 dark:text-white">
            <h1>Liste des employées</h1>
            <div>
                {employees?.length > 0 && (
                    employees.map((employee) => (
                        <div key={employee.id} className="w-full bg-sky-200 p-3 mt-2 rounded">
                            <h2>{employee.first_name} {employee.last_name}</h2>
                            <div className="">
                                <div>
                                    <div className="bg-green-200 px-2 py-1">
                                        {employee.email}
                                    </div>
                                    <div className="bg-green-200 px-2 py-1">
                                        {employee.role_label}
                                    </div>
                                </div>
                                <div>
                                    {format(new Date(employee.date_joined), 'dd MMMM yyyy', {locale: fr})}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default EmployeeList