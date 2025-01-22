import React, { ReactElement } from "react";

import DashboardLayout from "@/pages/dashboard/layout";
import ClientForm from "@/pages/dashboard/clients/components/ClientForm";

const ClientEditPage = () => {
  return (
    <>
      <ClientForm action="edit" />
    </>
  );
};

ClientEditPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ClientEditPage;
