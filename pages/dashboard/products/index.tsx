import React, { ReactElement, useState } from "react";
import DashboardLayout from "../layout";

import ProductList from "@/pages/dashboard/products/components/ProductList";
import { AccordionElem } from "@/components/AccordionElem";
import ProductMeasureUnitList from "@/pages/dashboard/products/components/ProductMeasureUnitList";

const ProductPage = () => {
  return (
    <div className="flex flex-col gap-10 bg-white h-full">
      <div className="mt-10 bg-white px-7">
        <AccordionElem
          title={"Paramétrage unité de mesure des produits"}
          content={<ProductMeasureUnitList />}
          className="bg-gray-100 rounded-md text-black"
        />
      </div>
      <div className="mb-10">
        <ProductList />
      </div>
    </div>
  );
};

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductPage;
