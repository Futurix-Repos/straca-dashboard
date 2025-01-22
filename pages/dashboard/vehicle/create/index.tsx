import React, { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import VehicleForm from "@/pages/dashboard/vehicle/components/VehicleForm";
import DashboardLayout from "@/pages/dashboard/layout";

const VehicleCreatePage = () => {
  return (
    <>
      <VehicleForm action="add" />
    </>
  );
};

VehicleCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehicleCreatePage;
