import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { VehicleModel } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const VehicleModelTable = () => {
  const router = useRouter();
  const { setSelectedVehicleModel } = useSettings();

  const [search, setSearch] = useState("");

  //====== Vehicle Model =====
  const { data: vehicleModelData, isLoading: isLoadingVehicleModel } =
    useQuery<VehicleModel>({
      queryKey: ["vehicleModels", search],
      queryFn: () =>
        GET(`/vehicleModels`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteVehicleModel = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/vehicleModels/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleModels"] });
      Toast.fire({
        icon: "success",
        title: "Modèle de véhicule supprimée avec succès",
      });
    },
  });
  //====== Vehicle model =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteVehicleModel.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=vehicleModels`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=vehicleModels");
  };

  return (
    <SettingTable
      type={"vehicleModels"}
      title={"Liste des modèles de véhicule"}
      handleDelete={(itemId) => {
        handleDelete({ itemId });
      }}
      handleModify={(item) => {
        handleModify({ item });
      }}
      handleCreate={() => {
        handleCreate();
      }}
      setSearchText={(value) => setSearch(value)}
      isLoading={isLoadingVehicleModel}
      data={vehicleModelData}
    />
  );
};

export default VehicleModelTable;
