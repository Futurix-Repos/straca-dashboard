import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";
import EmployeeListComponent from "@/pages/dashboard/partners/components/EmployeeList";

const PartnersPage = () => {
  // Access action query parameter

  return (
    <>
      <EmployeeListComponent /> /
    </>
  );
};

PartnersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default PartnersPage;
