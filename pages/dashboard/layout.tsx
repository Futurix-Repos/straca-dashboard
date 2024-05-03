'use client';

import Sidebar from '@/components/Sidebar';
import React, { Fragment, useState } from 'react'

interface Props {
    children: React.ReactNode;
    title: string;
    handleChangeItem: (val: any) => void;
}

export const SIDEBAR_ITEMS: any = [
    {
        id: "dashboard",
        label: "Tableau de bord",
        url: "/dashboard",
    },
    {
        id: "clients",
        label: "Clients",
        url: "/dashboard/clients",
    },
    {
        id: "commandes",
        label: "Commandes",
        url: "/dashboard/orders",
    },
    {
        id: "collaborateurs",
        label: "Collaborateurs",
        url: "/dashboard/partners",
    },
    {
        id: "blogs",
        label: "Blogs",
        url: "/dashboard/blogs",
    },
    {
        id: "jobs",
        label: "Offres d’emplois",
        url: "/dashboard/jobs",
    },
    {
        id: "tracking",
        label: "Gestion Flotte et Tracking",
        url: "/dashboard/tracking",
    },
    {
        id: "setting",
        label: "Paramètres",
        url: "/dashboard/setting",
    },
    // {
    //     label: "Templates",
    //     url: "/",
    //     // target: "blank"
    // },
    // {
    //     label: "Contact",
    //     url: "https://tidycal.com/yuvalsuede/60-minute-consultation-with-yuval",
    //     target: "blank"
    // },
    // {
    //     label: "Account",
    //     url: "https://www.linkedin.com/in/yuval-suede/",
    //     target: "blank"
    // },
];

const DashboardLayout = ({children} : any) => {
    const [showPopup, setShowPopup] = useState(false);

    const handlePopup = () => {
        setShowPopup(!showPopup);
    }
    
    return (
        <Fragment>
        
            <div className="min-h-screen bg-white relative w-full md:flex md:flex-row">
                <div className="md:hidden z-10 fixed left-0 top-0 h-full">
                    <Sidebar onShowPopup={handlePopup} items={SIDEBAR_ITEMS} />
                </div>
                <div className="hidden md:block md:relative ">
                    <Sidebar onShowPopup={handlePopup} items={SIDEBAR_ITEMS}  />
                </div>
                <main className="w-full md:flex-grow bg-gray-50">
                    {/* {title && <h1 className="text-black text-2xl font-bold mb-4 mt-10 pr-4 pl-4 pt-4">{title}</h1>} */}
                    {children}
                </main>
            </div>
        </Fragment>
    );
}

export default DashboardLayout