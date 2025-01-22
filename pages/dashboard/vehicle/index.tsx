import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";

import VehicleListComponent from "@/pages/dashboard/vehicle/components/VehicleList";

const VehiclePage = () => {
  return (
    <>
      <VehicleListComponent />
    </>
  );
};

VehiclePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehiclePage;
