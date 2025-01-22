import { renderInputField } from "@/components/InputComponents/InputComponents";

import { GET, POST, PUT } from "@/constants/fetchConfig";
import { BLOG_INPUTS, JOB_INPUTS, TRACKING_INPUT } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import router, { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
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

const VehicleForm = ({ action }: { action: "add" | "edit" }) => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [selectedSource, setSelectedSource] = useState<VehicleSource | null>(
    null,
  );
  const [selectDriver, setSelectedDriver] = useState<UserType | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { data: vehicleData, isLoading: isLoadingVehicle } = useQuery<Vehicle>({
    queryKey: ["getVehicleEdit", id],
    queryFn: () => GET(`/vehicles/${id}`),
    enabled: action === "edit" && (id ?? "").length > 0,
    refetchOnWindowFocus: true,
  });

  const addVehicleMutation = useMutation({
    mutationFn: (payload: any) => POST(`/vehicles`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
      Toast.fire({
        icon: "success",
        title: `Le véhicule a eté ajouté avec succès`,
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
    mutationFn: (payload: any) => PUT(`/vehicles/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getVehicleEdit", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

      Toast.fire({
        icon: "success",
        title: `Le véhicule a été modifié avec succès`,
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
      name.trim() === "" ||
      registrationNumber.trim() === "" ||
      trackingId.trim() === "" ||
      !selectedModel?._id ||
      !selectedType?._id ||
      !selectedSource?._id ||
      !selectDriver?._id
    );
  }, [
    name,
    registrationNumber,
    selectDriver?._id,
    selectedModel?._id,
    selectedSource?._id,
    selectedType?._id,
    trackingId,
  ]);
  const wasChanged = useMemo(() => {
    if (action === "edit" && vehicleData) {
      return (
        name !== vehicleData.name ||
        registrationNumber !== vehicleData.registrationNumber ||
        trackingId !== vehicleData.trackingId ||
        selectedModel?._id !== vehicleData.model?._id ||
        selectedType?._id !== vehicleData.type?._id ||
        selectedSource?._id !== vehicleData.source?._id ||
        selectDriver?._id !== vehicleData.driver?._id
      );
    }
    return false;
  }, [
    action,
    vehicleData,
    name,
    registrationNumber,
    trackingId,
    selectedModel,
    selectedType,
    selectedSource,
    selectDriver,
  ]);

  // Function to add blog
  const addTracking = async () => {
    const session: any | Session = await getSession();
    const currentUser = session?.user;

    let newVehicle: any = {
      ...(name.trim().length > 0 && { name }),
      ...(registrationNumber.trim().length > 0 && { registrationNumber }),
      ...(trackingId.trim().length > 0 && { trackingId }),
      ...(selectedModel?._id && { model: selectedModel._id }),
      ...(selectedType?._id && { type: selectedType._id }),
      ...(selectedSource?._id && { source: selectedSource._id }),
      ...(selectDriver?._id && { driver: selectDriver._id }),
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
      addVehicleMutation.mutate(newVehicle);
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
    if (action === "edit" && vehicleData) {
      setName(vehicleData.name ?? "");
      setRegistrationNumber(vehicleData.registrationNumber ?? "");
      setTrackingId(vehicleData.trackingId ?? "");
      setSelectedModel(vehicleData.model ?? null);
      setSelectedType(vehicleData.type ?? null);
      setSelectedSource(vehicleData.source ?? null);
      setSelectedDriver(vehicleData.driver ?? null);
    }
  }, [action, vehicleData]);

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
        <p className="ml-2 font-semibold text-2xl">{`Créer un véhicule`}</p>
      </div>
      <div className="w-full flex flex-col gap-5">
        {action === "edit" && isLoadingVehicle ? (
          <CustomLoader />
        ) : (
          <div className="flex pt-5 justify-between">
            <div className="w-full px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
              <div className="mb-5 flex flex-row justify-between items-center">
                <div className="flex flex-row justify-between">
                  <p className="mb-3 font-semibold text-2xl">Flotte et suivi</p>
                </div>
              </div>
              <div className="w-full flex flex-col gap-5 ">
                {renderInputField(
                  TRACKING_INPUT[0],
                  name,
                  (e) => setName(e.target.value),
                  undefined,
                  undefined,
                  "w-full",
                )}
                <div className="flex lg:flex-row flex-col lg:gap-5">
                  <div className="w-1/2">
                    {" "}
                    {renderInputField(
                      TRACKING_INPUT[1],
                      registrationNumber,
                      (e) => setRegistrationNumber(e.target.value),
                      undefined,
                      undefined,
                      "w-full",
                    )}
                  </div>
                  <div className="w-1/2">
                    {" "}
                    {renderInputField(
                      TRACKING_INPUT[2],
                      trackingId,
                      (e) => setTrackingId(e.target.value),
                      undefined,
                      undefined,
                      "w-full",
                    )}
                  </div>
                </div>

                <VehicleTypeSelect
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
                <div className="flex lg:flex-row flex-col lg:gap-5">
                  <VehicleSourceSelect
                    selectedSource={selectedSource}
                    setSelectedSource={setSelectedSource}
                  />
                  <VehicleModelSelect
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                  />
                </div>

                <EmployeeSelect
                  selectedEmployee={selectDriver}
                  setSelectedEmployee={setSelectedDriver}
                />
              </div>
              <div>
                <button
                  onClick={addTracking}
                  className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
                >
                  {addVehicleMutation.isPending ||
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

export default VehicleForm;
