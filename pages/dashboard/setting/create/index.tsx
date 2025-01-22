import React, { ReactElement } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import CreateSettingsForm from "@/pages/dashboard/setting/components/CreateSettingsForm";

const CreateSettingsPage = () => {
  return <CreateSettingsForm />;
};

CreateSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateSettingsPage;
