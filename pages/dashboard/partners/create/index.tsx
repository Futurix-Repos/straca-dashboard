import React, { ReactElement } from "react";

import EmployeeForm from "@/pages/dashboard/partners/components/EmployeeForm";
import DashboardLayout from "@/pages/dashboard/layout";

const EmployeeCreatePage = () => {
  return (
    <>
      <EmployeeForm action="create" />
    </>
  );
};

EmployeeCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EmployeeCreatePage;
