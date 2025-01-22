import React, { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import VehicleForm from "@/pages/dashboard/vehicle/components/VehicleForm";
import DashboardLayout from "@/pages/dashboard/layout";

const VehicleEditPage = () => {
  return (
    <>
      <VehicleForm action="edit" />
    </>
  );
};

VehicleEditPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehicleEditPage;
