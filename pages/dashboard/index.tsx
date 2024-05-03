import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import { SessionProvider } from 'next-auth/react';
import DashboardLayout from './layout';
import DashboardScreen from '@/components/dashboard_components/DashboardScreen';

const Page: NextPageWithLayout = () => {
    return (
        <DashboardScreen />
    )
}

Page.getLayout = function getLayout(page: ReactElement,) {
    return (
        <SessionProvider>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </SessionProvider>
    )
}

export default Page