import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SettingElemType, ProductType, VehicleType } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const VehicleTypeTable = () => {
  const router = useRouter();
  const { setSelectedVehicleType } = useSettings();

  const [search, setSearch] = useState("");

  //====== Vehicle type =====
  const { data: vehicleTypeData, isLoading: isLoadingVehicleType } =
    useQuery<VehicleType>({
      queryKey: ["vehicleTypes", search],
      queryFn: () =>
        GET(`/vehicleTypes`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteVehicleType = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/vehicleTypes/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] });
      Toast.fire({
        icon: "success",
        title: "Catégorie de véhicule supprimée avec succès",
      });
    },
  });
  //====== Vehicle type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteVehicleType.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=vehicleType`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=vehicleType");
  };

  return (
    <SettingTable
      title={"Liste des catégories de véhicule"}
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
      isLoading={isLoadingVehicleType}
      data={vehicleTypeData}
    />
  );
};

export default VehicleTypeTable;
