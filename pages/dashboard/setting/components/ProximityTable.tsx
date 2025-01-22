import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SettingElemType, ProductType, Proximity } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const ProximityTable = () => {
  const router = useRouter();
  const { setSelectedProximity } = useSettings();

  const [search, setSearch] = useState("");

  //====== Proximity type =====
  const { data: proximityData, isLoading: isLoadingProximity } =
    useQuery<Proximity>({
      queryKey: ["proximities", search],
      queryFn: () =>
        GET(`/proximity`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteProximity = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/proximity/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proximities"] });
      Toast.fire({
        icon: "success",
        title: "Proximité supprimé avec succès",
      });
    },
  });
  //====== Proximité type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteProximity.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=proximity`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=proximity");
  };

  return (
    <SettingTable
      title={"Liste des proximités de job"}
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
      isLoading={isLoadingProximity}
      data={proximityData}
    />
  );
};

export default ProximityTable;
