import React, { ReactElement } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import OrderForm from "@/pages/dashboard/orders/components/OrderForm";

const CreateOrderPage = () => {
  return (
    <>
      <OrderForm action="create" />
    </>
  );
};

CreateOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateOrderPage;
