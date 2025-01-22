import React, { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import VehicleForm from "@/pages/dashboard/vehicle/components/VehicleForm";
import DashboardLayout from "@/pages/dashboard/layout";
import ProductForm from "@/pages/dashboard/products/components/ProductForm";
import ProductMeasureUnitForm from "@/pages/dashboard/productMeasureUnits/components/ProductMeasureUnitForm";

const ProductMeasureUnitCreatePage = () => {
  return (
    <>
      <ProductMeasureUnitForm action="add" />
    </>
  );
};

ProductMeasureUnitCreatePage.getLayout = function getLayout(
  page: ReactElement,
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductMeasureUnitCreatePage;
