import React, { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import VehicleForm from "@/pages/dashboard/vehicle/components/VehicleForm";
import DashboardLayout from "@/pages/dashboard/layout";
import ProductForm from "@/pages/dashboard/products/components/ProductForm";

const ProductEditPage = () => {
  return (
    <>
      <ProductForm action="edit" />
    </>
  );
};

ProductEditPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductEditPage;
