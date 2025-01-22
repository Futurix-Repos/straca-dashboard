"use client";

import Sidebar from "@/components/Sidebar";
import React, { Fragment, useState } from "react";
import clsx from "clsx";
import { LuLayoutDashboard, LuUsersRound } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoBookOutline, IoSettingsOutline } from "react-icons/io5";
import { TbPackages, TbTruckDelivery } from "react-icons/tb";
import { MdOutlineWorkHistory } from "react-icons/md";
import { RiTruckLine } from "react-icons/ri";
import { BiPackage } from "react-icons/bi";
import { GiMineTruck } from "react-icons/gi";
import { LiaTruckLoadingSolid } from "react-icons/lia";

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
    icon: LuLayoutDashboard,
  },
  {
    id: "clients",
    label: "Clients",
    url: "/dashboard/clients",
    icon: LuUsersRound,
  },
  {
    id: "commandes",
    label: "Commandes",
    url: "/dashboard/orders",
    icon: TbPackages,
  },
  {
    id: "deliveries",
    label: "Voyages",
    url: "/dashboard/deliveries",
    icon: LiaTruckLoadingSolid,
  },
  {
    id: "collaborateurs",
    label: "Collaborateurs",
    url: "/dashboard/partners",
    icon: HiOutlineUserGroup,
  },
  {
    id: "blogs",
    label: "Blogs",
    url: "/dashboard/blogs",
    icon: IoBookOutline,
  },
  {
    id: "jobs",
    label: "Offres d’emplois",
    url: "/dashboard/jobs",
    icon: MdOutlineWorkHistory,
  },
  {
    id: "product",
    label: "Produits",
    url: "/dashboard/products",
    icon: BiPackage,
  },
  {
    id: "tracking",
    label: "Gestion Flotte",
    url: "/dashboard/vehicle",
    icon: RiTruckLine,
  },
  {
    id: "setting",
    label: "Paramètres",
    url: "/dashboard/setting",
    icon: IoSettingsOutline,
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

const DashboardLayout = ({ children }: any) => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-white relative w-full md:flex md:flex-row">
        <Sidebar onShowPopup={handlePopup} items={SIDEBAR_ITEMS} />
        <main className="max-w-full overflow-auto md:flex-grow bg-gray-50">
          {/* {title && <h1 className="text-black text-2xl font-bold mb-4 mt-10 pr-4 pl-4 pt-4">{title}</h1>} */}
          {children}
        </main>
      </div>
    </Fragment>
  );
};

export default DashboardLayout;
