import React, { ReactElement } from "react";
import DashboardLayout from "../layout";
import OrderListComponent from "@/pages/dashboard/orders/components/OrderList";
import { useRouter } from "next/router";
import OrderForm from "./components/OrderForm";

const OrdersPage = () => {
  return (
    <>
      <OrderListComponent />
    </>
  );
};

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrdersPage;
