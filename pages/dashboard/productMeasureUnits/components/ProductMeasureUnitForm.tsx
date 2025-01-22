import { renderInputField } from "@/components/InputComponents/InputComponents";

import { GET, POST, PUT } from "@/constants/fetchConfig";
import {
  BLOG_INPUTS,
  JOB_INPUTS,
  PRODUCT_INPUT,
  TRACKING_INPUT,
} from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import router, { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  MeasureUnit,
  Pricing,
  Product,
  ProductMeasureUnit,
  ProductType,
  UserType,
  Vehicle,
  VehicleModel,
  VehicleSource,
  VehicleType,
} from "@/constants/types";
import { VehicleModelSelect } from "@/components/InputComponents/VehicleModelSelect";
import { VehicleSourceSelect } from "@/components/InputComponents/VehicleSourceSelect";
import { VehicleTypeSelect } from "@/components/InputComponents/VehicleTypeSelect";
import { EmployeeSelect } from "@/components/InputComponents/EmployeeSelect";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/pages/_app";
import CustomLoader from "@/components/CustomLoader";
import { ProductTypeSelect } from "@/components/InputComponents/ProductTypeSelect";
import { MeasureUnitSelect } from "@/components/InputComponents/MeasureUnitSelect";
import { NumericFormat } from "react-number-format";
import { ProductSelect } from "@/components/InputComponents/ProductSelect";

const ProductForm = ({ action }: { action: "add" | "edit" }) => {
  const router = useRouter();
  const { id } = router.query;

  const [amount, setAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState<
    MeasureUnit | MeasureUnit[] | null
  >(null);

  const {
    data: productMeasureUnitData,
    isLoading: isLoadingProductMeasureUnit,
  } = useQuery<ProductMeasureUnit>({
    queryKey: ["getProductMeasureUnitEdit", id],
    queryFn: () => GET(`/productMeasureUnits/${id}`),
    enabled: action === "edit" && (id ?? "").length > 0,
    refetchOnWindowFocus: true,
  });

  const addProductMeasureUnitMutation = useMutation({
    mutationFn: (payload: any) => POST(`/productMeasureUnits`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productMeasureUnits"],
      });
      Toast.fire({
        icon: "success",
        title: `L'unité de mesure a eté ajouté avec succès`,
      });
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const editProductMeasureUnitMutation = useMutation({
    mutationFn: (payload: any) => PUT(`/productMeasureUnits/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProductMeasureUnitEdit", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["productMeasureUnits"],
      });

      Toast.fire({
        icon: "success",
        title: `L'unité de mesure a été modifié avec succès`,
      });
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const fieldsValidation = useMemo(() => {
    return (
      amount.trim() === "" ||
      selectedProduct === null ||
      selectedMeasureUnit === null
    );
  }, [amount, selectedProduct, selectedMeasureUnit]);
  const wasChanged = useMemo(() => {
    if (action === "edit" && productMeasureUnitData) {
      return (
        amount !== productMeasureUnitData.amount.toString() ||
        selectedProduct?._id !== productMeasureUnitData.product._id ||
        (selectedMeasureUnit as MeasureUnit)?._id !==
          productMeasureUnitData.measureUnit._id
      );
    }
    return false;
  }, [
    action,
    productMeasureUnitData,
    amount,
    selectedProduct?._id,
    selectedMeasureUnit,
  ]);

  const isProductItemDisabled = useCallback(
    (product: Product) => {
      if (selectedMeasureUnit) {
        if (
          action === "edit" &&
          product._id === productMeasureUnitData?.product._id
        )
          return false;

        return (
          (selectedMeasureUnit as MeasureUnit).products?.some(
            (pr) => pr.product._id === product._id,
          ) && selectedProduct?._id !== product._id
        );
      } else return false;
    },
    [
      action,
      productMeasureUnitData?.product._id,
      selectedMeasureUnit,
      selectedProduct?._id,
    ],
  );
  const isMeasureItemDisabled = useCallback(
    (measure: MeasureUnit) => {
      if (selectedProduct) {
        if (
          action === "edit" &&
          measure._id === productMeasureUnitData?.measureUnit._id
        )
          return false;
        return (
          selectedProduct.measureUnits?.some(
            (mu) => mu.measureUnit._id === measure._id,
          ) && (selectedMeasureUnit as MeasureUnit)?._id !== measure._id
        );
      } else return false;
    },
    [
      selectedProduct,
      action,
      productMeasureUnitData?.measureUnit._id,
      selectedMeasureUnit,
    ],
  );

  // Function to add blog
  const addTracking = async () => {
    const session: any | Session = await getSession();
    const currentUser = session?.user;

    let newVehicle: any = {
      ...(amount.trim().length > 0 && { amount: Number(amount) }),
      ...(selectedProduct !== null && {
        product: selectedProduct._id,
      }),
      ...(selectedMeasureUnit !== null && {
        measureUnit: (selectedMeasureUnit as MeasureUnit)._id,
      }),
    };

    if (fieldsValidation) {
      Toast.fire({
        icon: "error",
        title: `Merci de remplir tous les champs`,
      });
      return;
    }

    if (action === "add") {
      addProductMeasureUnitMutation.mutate(newVehicle);
    } else {
      if (!wasChanged) {
        Toast.fire({
          icon: "error",
          title: `Veuillez modifier les champs`,
        });
        return;
      }
      editProductMeasureUnitMutation.mutate(newVehicle);
    }
  };

  useEffect(() => {
    if (action === "edit" && productMeasureUnitData) {
      setAmount(productMeasureUnitData.amount.toString() ?? "");
      setSelectedProduct(productMeasureUnitData.product ?? "");
      setSelectedMeasureUnit(productMeasureUnitData.measureUnit ?? "");
    }
  }, [action, productMeasureUnitData]);

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-start items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="px-4 py-2 bg-slate-400 rounded-sm"
        >
          <i className="fa-solid fa-arrow-left text-white"></i>
        </button>
        <p className="ml-2 font-semibold text-2xl">{`${action === "add" ? "Créer" : "Modifier"} un produit`}</p>
      </div>
      <div className="w-full flex flex-col gap-5">
        {action === "edit" && isLoadingProductMeasureUnit ? (
          <CustomLoader />
        ) : (
          <div className="flex pt-5 justify-between">
            <div className="w-full px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
              <div className="w-full flex flex-col gap-5 ">
                <div className="flex flex-col">
                  <label className="text-base">Montant/Unité</label>
                  <NumericFormat
                    allowNegative={false}
                    placeholder="Veuillez entrer le prix/unité"
                    thousandSeparator={" "}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-0 sm:text-sm sm:leading-6"
                    value={amount}
                    onValueChange={(values) => {
                      setAmount(values.value);
                    }}
                  />
                </div>

                <div className="">
                  <ProductSelect
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    itemIsDisabled={isProductItemDisabled}
                  />
                </div>

                <div className="">
                  <MeasureUnitSelect
                    selectedMeasureUnit={selectedMeasureUnit}
                    setSelectedMeasureUnit={setSelectedMeasureUnit}
                    itemIsDisabled={isMeasureItemDisabled}
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={addTracking}
                  className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
                >
                  {addProductMeasureUnitMutation.isPending ||
                  editProductMeasureUnitMutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    `Enregistrer`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
