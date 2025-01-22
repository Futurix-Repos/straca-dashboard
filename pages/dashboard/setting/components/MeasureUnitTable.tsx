import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SettingElemType, ProductType, MeasureUnit } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const MeasureUnitTable = () => {
  const router = useRouter();
  const { setSelectedProductType } = useSettings();

  const [search, setSearch] = useState("");

  //====== Product type =====
  const { data: measureUnitData, isLoading: isLoadingMeasureUnit } =
    useQuery<MeasureUnit>({
      queryKey: ["measureUnits", search],
      queryFn: () =>
        GET(`/measureUnits`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteMeasureUnit = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/measureUnits/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measureUnits"] });
      Toast.fire({
        icon: "success",
        title: "Unité de mesure supprimé avec succès",
      });
    },
  });
  //====== Product type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteMeasureUnit.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    setSelectedProductType(item);
    router.push(`/dashboard/setting/${item._id}?type=measureUnits`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=measureUnits");
  };

  return (
    <SettingTable
      title={"Liste des unités de mesure"}
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
      isLoading={isLoadingMeasureUnit}
      data={measureUnitData}
    />
  );
};
export default MeasureUnitTable;
