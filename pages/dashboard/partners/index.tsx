import React, { ReactElement, useState } from 'react'
import DashboardLayout from '../layout'
import { Employee, EmployeeListComponent } from '@/components/dashboard_components/EmployeeList'
import { useRouter } from 'next/router';
import EmployeeForm from './EmployeeForm';


const PartnersPage = () => {
  const [selectedEmployee , setSelectedEmployee] = useState<Employee | null>(null);

  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  console.log(action);
  
  return (
    <>
    {action === 'new'|| action=== 'edit' ? (
      <EmployeeForm selectedEmployee={selectedEmployee} /> // Render JobForm if action is "new"
    ) : (
      <EmployeeListComponent setSelectedEmployee={setSelectedEmployee}/> // Render JobListComponent otherwise
    )}
  </>
  )
}

PartnersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  )
}

export default PartnersPage