// EditSettingsForm.tsx

import { renderSettingsTextField } from "@/components/InputComponents/settinginputcomponent";
import { settingElemTypes, VehicleBrand } from "@/constants/types";
import { GET, PUT } from "@/constants/fetchConfig";
import { PRODUCT_CONFIG_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { elemTypeToDisplay } from "@/constants/helpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/pages/_app";
import CustomLoader from "@/components/CustomLoader";
import { VehicleBrandSelect } from "@/components/InputComponents/VehicleBrandSelect";
import { Loader2 } from "lucide-react";

const EditSettingsForm: React.FC = () => {
  const router = useRouter();
  const { type, id } = router.query;

  const [label, setLabel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const { data: itemData, isLoading: isLoadingItem } = useQuery<any>({
    queryKey: ["editSetting", id, type],
    queryFn: () => GET(`/${type}/${id}`),
    enabled: (type ?? "").length > 0 && (id ?? "").length > 0,
    refetchOnWindowFocus: true,
  });

  const editItemMutation = useMutation({
    mutationFn: (payload: {
      label?: string;
      description?: string;
      brand?: string;
    }) => PUT(`/${type}/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["editSetting", id, type],
      });
      Toast.fire({
        icon: "success",
        title: `${type} modifié avec succès`,
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

  const wasChanged = useCallback(() => {
    if (
      settingElemTypes.includes(type as any) &&
      (label !== itemData?.label ||
        description !== itemData?.description ||
        (type === "vehicleModel" && selectedBrand?._id !== itemData.brand._id))
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [description, label, itemData, type, selectedBrand]);

  const typeString = useMemo(() => {
    if (typeof type === "string") {
      return elemTypeToDisplay(type);
    } else return "";
  }, [type]);

  useEffect(() => {
    if (itemData && type) {
      if (settingElemTypes.includes(type as any)) {
        setLabel(itemData.label);
        setDescription(itemData.description);
        if (type === "vehicleModel") {
          setSelectedBrand(itemData.brand ?? null);
        }
      }
    }
  }, [type, itemData]);

  useEffect(() => {
    wasChanged();
  }, [label, description, wasChanged]);

  const addType = async () => {
    const newType = {
      ...(label.length > 0 && { label: label }),
      ...(description.length > 0 && { description: description }),
      ...(type === "vehicleModel" &&
        selectedBrand != null && { brand: selectedBrand._id }),
    };
    if (label.trim() === "" || description.trim() === "") {
      return Toast.fire({
        icon: "error",
        title: `Les champs doivent être remplis`,
      });
    }

    try {
      if (isChanged) {
        editItemMutation.mutate(newType);
      } else {
        Toast.fire({
          icon: "error",
          title: `Aucun champ modifié`,
        });
      }
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
        <p className="ml-2 font-semibold text-2xl">{`Modifier un(e) ${typeString}`}</p>
      </div>

      {/* Form */}
      {isLoadingItem ? (
        <CustomLoader />
      ) : (
        <div className="flex flex-col mt-12 gap-6">
          {renderSettingsTextField(PRODUCT_CONFIG_INPUTS[0], label, (e) => {
            setLabel(e.target.value);
          })}
          {renderSettingsTextField(PRODUCT_CONFIG_INPUTS[1], description, (e) =>
            setDescription(e.target.value),
          )}
          {type === "vehicleModel" && (
            <VehicleBrandSelect
              show={type === "vehicleModel"}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
            />
          )}
        </div>
      )}
      <div className="mt-10 flex flex-row gap-5">
        <button
          onClick={addType}
          className="h-12 w-80 bg-[#3D75B0] text-white rounded-md flex items-center justify-center"
        >
          {editItemMutation.isPending ? (
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

export default EditSettingsForm;
