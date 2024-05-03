import { SIDEBAR_ITEMS } from '@/pages/dashboard/layout';
import React, { createContext, useState } from 'react';

export type SidebarItemType = {
    label: "Account",
    url: "https://www.linkedin.com/in/yuval-suede/",
    target: "blank"
}

type SidebarContextType = {
    selectedSidebarItem: SidebarItemType,
    changeSidebarItem: React.Dispatch<React.SetStateAction<SidebarContextType | null>>;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarContextProvider = (props: any) => {
    const [selectedSidebarItem, setSelectedSidebarItem] = useState<SidebarContextType>(SIDEBAR_ITEMS[0]);

    const changeSidebarItem = (newItem: any) => {
        setSelectedSidebarItem(newItem);
    }

    const contextValue: any = {
        selectedSidebarItem,
        changeSidebarItem,
    };

    return (
        <SidebarContext.Provider value={contextValue}>{props.children}</SidebarContext.Provider>
    );
}