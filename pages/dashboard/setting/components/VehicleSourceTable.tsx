import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  SettingElemType,
  ProductType,
  VehicleSource,
  VehicleType,
} from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const VehicleSourceTable = () => {
  const router = useRouter();
  const { setSelectedVehicleSource } = useSettings();

  const [search, setSearch] = useState("");

  //====== Vehicle type =====
  const { data: vehicleSourceData, isLoading: isLoadingVehicleSource } =
    useQuery<VehicleSource>({
      queryKey: ["vehicleSources", search],
      queryFn: () =>
        GET(`/vehicleSources`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteVehicleSource = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/vehicleSources/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleSources"] });
      Toast.fire({
        icon: "success",
        title: "Source de véhicule supprimée avec succès",
      });
    },
  });
  //====== Vehicle source =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteVehicleSource.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=vehicleSources`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=vehicleSources");
  };

  return (
    <SettingTable
      title={"Liste des sources de véhicule"}
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
      isLoading={isLoadingVehicleSource}
      data={vehicleSourceData}
    />
  );
};

export default VehicleSourceTable;
