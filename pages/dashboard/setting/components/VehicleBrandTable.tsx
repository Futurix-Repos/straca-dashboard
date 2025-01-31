import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { VehicleBrand } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const VehicleBrandTable = () => {
  const router = useRouter();
  const { setSelectedVehicleBrand } = useSettings();

  const [search, setSearch] = useState("");

  //====== Vehicle type =====
  const { data: vehicleBrandData, isLoading: isLoadingVehicleBrand } =
    useQuery<VehicleBrand>({
      queryKey: ["vehicleBrands", search],
      queryFn: () =>
        GET(`/vehicleBrands`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteVehicleBrand = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/vehicleBrands/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleBrands"] });
      Toast.fire({
        icon: "success",
        title: "Marque de véhicule supprimée avec succès",
      });
    },
  });
  //====== Vehicle brand =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteVehicleBrand.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=vehicleBrands`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=vehicleBrands");
  };

  return (
    <SettingTable
      title={"Liste des marques de véhicule"}
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
      isLoading={isLoadingVehicleBrand}
      data={vehicleBrandData}
    />
  );
};

export default VehicleBrandTable;
