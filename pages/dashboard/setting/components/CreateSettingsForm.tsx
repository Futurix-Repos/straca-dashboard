// CreateSettingsForm.tsx
import { renderInputField } from "@/components/InputComponents/InputComponents";
import { renderSettingsTextField } from "@/components/InputComponents/settinginputcomponent";
import {
  BlogType,
  ContractType,
  ProductType,
  Proximity,
  VehicleBrand,
  VehicleSource,
  VehicleType,
  Location,
  VehicleModel,
  MeasureUnit,
} from "@/constants/types";
import { POST, PUT } from "@/constants/fetchConfig";
import { PRODUCT_CONFIG_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { useSettings } from "@/context/settingscontext";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { elemTypeToDisplay } from "@/constants/helpers";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/pages/_app";
import { VehicleBrandSelect } from "@/components/InputComponents/VehicleBrandSelect";
import { ProductTypeSelect } from "@/components/InputComponents/ProductTypeSelect";
import { Loader2 } from "lucide-react";
import { MeasureUnitSelect } from "@/components/InputComponents/MeasureUnitSelect";

const CreateSettingsForm: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;

  const [label, setLabel] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);
  const [selectedMeasureUnits, setSelectedMeasureUnits] = useState<
    MeasureUnit | MeasureUnit[] | null
  >([]);

  const createItemMutation = useMutation({
    mutationFn: (payload: { label: string; description: string }) =>
      POST(`/${type}/`, payload),
    onSuccess: () => {
      router.back();
      Toast.fire({
        icon: "success",
        title: `${typeString} ajouté avec succès`,
      });
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const typeString = useMemo(() => {
    if (typeof type === "string") {
      return elemTypeToDisplay(type);
    } else return "";
  }, [type]);

  const addType = async () => {
    const newType = {
      label: label,
      description: description,
      ...(type === "vehicleModels" && { brand: selectedBrand?._id }),
      ...(type === "products" && { productType: selectedProductType?._id }),
      ...(type === "products" && {
        measureUnits: Array.isArray(selectedMeasureUnits)
          ? selectedMeasureUnits.map((unit) => unit._id)
          : selectedMeasureUnits?._id,
      }),
    };
    if (
      label.trim() === "" ||
      description.trim() === "" ||
      (type === "vehicleModels" && selectedBrand === null) ||
      (type === "products" && selectedProductType === null) ||
      (type === "products" &&
        (selectedMeasureUnits === null ||
          ((selectedMeasureUnits as MeasureUnit[]) ?? []).length === 0))
    ) {
      return Toast.fire({
        icon: "error",
        title: `Les champs doivent être remplis`,
      });
    }

    try {
      createItemMutation.mutate(newType);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: { error },
      });
    }
  };

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
        <p className="ml-2 font-semibold text-2xl">{`Créer un(e) ${typeString}`}</p>
      </div>

      {/* Form */}
      <div className="flex flex-col mt-12 gap-6">
        {renderSettingsTextField(PRODUCT_CONFIG_INPUTS[0], label, (e) => {
          setLabel(e.target.value);
        })}
        {renderSettingsTextField(PRODUCT_CONFIG_INPUTS[1], description, (e) =>
          setDescription(e.target.value),
        )}
        {type === "vehicleModels" && (
          <div className="w-[60%]">
            <VehicleBrandSelect
              show={type === "vehicleModels"}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
            />
          </div>
        )}
        {type === "products" && (
          <div className="w-[60%]">
            <ProductTypeSelect
              show={type === "products"}
              selectedProductType={selectedProductType}
              setSelectedProductType={setSelectedProductType}
            />
          </div>
        )}
        {type === "products" && (
          <div className="w-[60%]">
            <MeasureUnitSelect
              multiple={true}
              show={type === "products"}
              selectedMeasureUnit={selectedMeasureUnits}
              setSelectedMeasureUnit={setSelectedMeasureUnits}
            />
          </div>
        )}
      </div>
      <div className="mt-10 flex flex-row gap-5">
        <button
          onClick={addType}
          className="h-12 w-80 bg-[#3D75B0] text-white rounded-md flex items-center justify-center"
        >
          {createItemMutation.isPending ? (
            <Loader2 className="animate-spin " size={20} />
          ) : (
            `Enregistrer`
          )}
        </button>
        <button
          onClick={() => {
            router.back();
          }}
          className="h-12 w-80 border-solid border-gray-400 border-2 text-black rounded-md"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CreateSettingsForm;
