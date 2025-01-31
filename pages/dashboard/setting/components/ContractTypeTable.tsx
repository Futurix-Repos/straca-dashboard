import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ContractType, SettingElemType, ProductType } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const ContractTypeTable = () => {
  const router = useRouter();
  const { setSelectedContractType } = useSettings();

  const [search, setSearch] = useState("");

  //====== Contract type =====
  const { data: contractTypeData, isLoading: isLoadingContractType } =
    useQuery<ContractType>({
      queryKey: ["contractTypes", search],
      queryFn: () =>
        GET(`/contractTypes`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteContractType = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/contractTypes/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractTypes"] });
      Toast.fire({
        icon: "success",
        title: "Type de contrat supprimée avec succès",
      });
    },
  });
  //====== Vehicle type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteContractType.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=contractTypes`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=contractTypes");
  };

  return (
    <SettingTable
      title={"Liste des types de contrats"}
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
      isLoading={isLoadingContractType}
      data={contractTypeData}
    />
  );
};
export default ContractTypeTable;
