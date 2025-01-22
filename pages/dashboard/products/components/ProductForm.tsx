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
  Pricing,
  Product,
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

const ProductForm = ({ action }: { action: "add" | "edit" }) => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);

  const { data: productData, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: ["getProductEdit", id],
    queryFn: () => GET(`/products/${id}`),
    enabled: action === "edit" && (id ?? "").length > 0,
    refetchOnWindowFocus: true,
  });

  const addProductMutation = useMutation({
    mutationFn: (payload: any) => POST(`/products`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      Toast.fire({
        icon: "success",
        title: `Le produit a eté ajouté avec succès`,
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

  const editVehicleMutation = useMutation({
    mutationFn: (payload: any) => PUT(`/products/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProductEdit", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      Toast.fire({
        icon: "success",
        title: `Le produit a été modifié avec succès`,
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
    return name.trim() === "" || description.trim() === "";
  }, [name, description]);
  const wasChanged = useMemo(() => {
    if (action === "edit" && productData) {
      return (
        name !== productData.name ||
        description !== productData.description ||
        selectedProductType?._id !== productData.productType._id
      );
    }
    return false;
  }, [action, productData, name, description, selectedProductType]);

  // Function to add blog
  const addTracking = async () => {
    const session: any | Session = await getSession();
    const currentUser = session?.user;

    let newVehicle: any = {
      ...(name.trim().length > 0 && { name }),
      ...(description.trim().length > 0 && { description: description }),
      ...(selectedProductType !== null && {
        productType: selectedProductType._id,
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
      newVehicle.createdBy = currentUser._id;
      addProductMutation.mutate(newVehicle);
    } else {
      if (!wasChanged) {
        Toast.fire({
          icon: "error",
          title: `Veuillez modifier les champs`,
        });
        return;
      }
      editVehicleMutation.mutate(newVehicle);
    }
  };

  useEffect(() => {
    if (action === "edit" && productData) {
      setName(productData.name ?? "");
      setDescription(productData.description ?? "");
      setSelectedProductType(productData.productType);
    }
  }, [action, productData]);

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
        {action === "edit" && isLoadingProduct ? (
          <CustomLoader />
        ) : (
          <div className="flex pt-5 justify-between">
            <div className="w-full px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
              <div className="w-full flex flex-col gap-5 ">
                {renderInputField(
                  PRODUCT_INPUT[0],
                  name,
                  (e) => setName(e.target.value),
                  undefined,
                  undefined,
                  "w-full",
                )}
                {renderInputField(
                  PRODUCT_INPUT[1],
                  description,
                  (e) => setDescription(e.target.value),
                  undefined,
                  undefined,
                  "w-full",
                )}
                <div className="">
                  <ProductTypeSelect
                    selectedProductType={selectedProductType}
                    setSelectedProductType={setSelectedProductType}
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={addTracking}
                  className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
                >
                  {addProductMutation.isPending ||
                  editVehicleMutation.isPending ? (
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
