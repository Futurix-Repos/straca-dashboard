import React, { ReactElement } from "react";
import DashboardLayout from "../layout";

import SettingScreen from "@/pages/dashboard/setting/components/SettingScreen";

const SettingsPage = () => {
  return <>{<SettingScreen />}</>;
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
