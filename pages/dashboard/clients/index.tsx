import React, { ReactElement, useState } from 'react'
import DashboardLayout from '../layout'
import { Client, ClientListComponent } from '@/components/dashboard_components/ClientList'
import { useRouter } from 'next/router';
import ClientForm from './clientForm';


const ClientsPage = () => {
  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  console.log(action);
  const [selectedClient , setSelectedClient] = useState<Client | null>(null);
  return (
    <>
    {action === 'new'|| action=== 'edit' ? (
      <ClientForm selectedClient={selectedClient}/> 
    ) : (
     <ClientListComponent setSelectedClient={setSelectedClient}/>
    )}
  </>
  )
}

ClientsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  )
}

export default ClientsPage;