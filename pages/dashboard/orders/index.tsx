import React, { ReactElement } from 'react'
import DashboardLayout from '../layout'
import { OrderListComponent } from '@/components/dashboard_components/OrderList'
import { useRouter } from 'next/router';
import OrderForm from './OrderForm';


const OrdersPage = () => {
  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  console.log(action);

  return (
    <>
      {action === 'new' ? (
        <OrderForm /> // Render JobForm if action is "new"
      ) : (
        <OrderListComponent /> // Render JobListComponent otherwise
      )}
    </>
  )
}

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  )
}

export default OrdersPage