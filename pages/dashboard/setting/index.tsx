import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";

import { useRouter } from "next/router";
import { SettingScreen } from "@/components/dashboard_components/settingScreen";
import SettingsForm from "./settingsForm";

const SettingsPage = () => {
  const router = useRouter();
  const { action, type } = router.query; // Access action query parameter

  return (
    <>
      {!action && !type? (
        <SettingScreen />
      ) : (
        <SettingsForm />
      )}
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
