import React, { ReactElement, useState } from 'react'
import DashboardLayout from '../layout'
import { Blog, BlogListComponent } from '@/components/dashboard_components/BlogList'
import { useRouter } from 'next/router'
import { Tracking, TrackingListComponent } from '@/components/dashboard_components/trackingList'
import TrackingForm from './trackingForm'


const TrackingPage = () => {
  const router = useRouter();
  const { action } = router.query; // Access action query parameter
  console.log(action);
  const [selectedTracking, setSelectedTracking] = useState<Tracking | null>(null);

  
  return (
    <>
      {action === 'new' || action === "edit" ? (
        <TrackingForm selectedTracking={selectedTracking}/> // Render JobForm if action is "new"
      ) : (
        <TrackingListComponent setSelectedTracking={setSelectedTracking}/> // Render JobListComponent otherwise
      )}
    </>
  )
}

TrackingPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  )
}

export default TrackingPage;