import React, { ReactElement } from "react";
import DashboardLayout from "../layout";
import { DeliveryListComponent } from "@/pages/dashboard/deliveries/components/DeliveryList";

const OrdersPage = () => {
  return (
    <>
      <DeliveryListComponent />
    </>
  );
};

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrdersPage;
