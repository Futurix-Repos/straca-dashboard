import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";
import ClientListComponent from "@/pages/dashboard/clients/components/ClientList";

const ClientsPage = () => {
  return (
    <>
      <ClientListComponent />
    </>
  );
};

ClientsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ClientsPage;
