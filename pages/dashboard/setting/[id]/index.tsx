import React, { ReactElement } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import EditSettingsForm from "@/pages/dashboard/setting/components/EditSettingsForm";

const EditSettingsPage = () => {
  return <EditSettingsForm />;
};

EditSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditSettingsPage;
