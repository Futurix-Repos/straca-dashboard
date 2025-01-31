import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Location } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const LocationTable = () => {
  const router = useRouter();
  const { setSelectedLocation } = useSettings();

  const [search, setSearch] = useState("");

  //====== Location =====
  const { data: locationData, isLoading: isLoadingLocation } =
    useQuery<Location>({
      queryKey: ["locations", search],
      queryFn: () =>
        GET(`/locations`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteLocation = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/locations/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      Toast.fire({
        icon: "success",
        title: "Site supprimé avec succès",
      });
    },
  });
  //====== Location  =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteLocation.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    setSelectedLocation(item);
    router.push(`/dashboard/setting/${item._id}?type=locations`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=locations");
  };

  return (
    <SettingTable
      title={"Liste des sites"}
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
      isLoading={isLoadingLocation}
      data={locationData}
    />
  );
};

export default LocationTable;
