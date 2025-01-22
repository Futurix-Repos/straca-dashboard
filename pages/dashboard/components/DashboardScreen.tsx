
import React, { useState, useEffect } from 'react'
import { GET } from "@/constants/fetchConfig";
import { Toast } from '@/constants/toastConfig';

const DashboardScreen = () => {
    const [totalColis, setTotalColis] = useState(0)
    const [totalClients, setTotalClients] = useState(0)
    const [colisDelivered, setColisDelivered] = useState(0)

    const fetchData = async () => {
        try {
            /*            const response = await fetch(`/dashboard`, {
                            method: 'GET',
                            // You can add headers or body payload if needed
                        });*/

            const response = await GET(`/dashboard`);

            const data = response;
            setTotalColis(data.totalColis || 0);
            setTotalClients(data.totalClients || 0);
            setColisDelivered(data.totalColisDelivered || 0);

        } catch (error) {
            console.error('Error fetching data:', error);
            // Display an alert dialog for the error
            Toast.fire({
                icon: "error",
                title: `Failed to Fetch Data. Please try again`,
            });
        }
    };

    useEffect(() => {

        fetchData();
        // You can add dependencies or modify the effect trigger as needed
    }, []); // Empty dependency array ensures this runs only once on component mount


    return (
        <div className='text-black p-5 flex items-center justify-center h-full'>
            {/* First Row */}
            <div className='flex gap-10'>
                <DashboardCard title={'Nombre total de colis'} label={`${totalColis}`} color='bg-indigo-600' />
                <DashboardCard title={'Nombre total des clients'} label={`${totalClients}`} color='bg-amber-500' />
                <DashboardCard title={'Nombre total de colis livré'} label={`${colisDelivered}`} color='bg-indigo-600' />
            </div>
        </div>
    )
}

interface Props {
    title: string;
    label: string;
    color: string;
}

const DashboardCard: React.FC<Props> = ({ title, label, color }) => {
    return (
        <div className={`w-64 h-40 p-4 ${color} rounded-lg justify-center items-center gap-2 flex flex-col`}>
            <div className="text-white text-lg font-normal">{title}</div>
            <div className="text-white text-lg font-normal">{label}</div>
        </div>
    )
}

export default DashboardScreen
