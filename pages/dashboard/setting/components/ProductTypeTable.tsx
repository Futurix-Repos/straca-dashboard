import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SettingElemType, ProductType } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";

const ProductTypeTable = () => {
  const router = useRouter();
  const { setSelectedProductType } = useSettings();

  const [search, setSearch] = useState("");

  //====== Product type =====
  const { data: productTypeData, isLoading: isLoadingProductType } =
    useQuery<ProductType>({
      queryKey: ["productTypes", search],
      queryFn: () =>
        GET(`/productTypes`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteProductType = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/productTypes/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
      Toast.fire({
        icon: "success",
        title: "Type de produit supprimé avec succès",
      });
    },
  });
  //====== Product type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteProductType.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    setSelectedProductType(item);
    router.push(`/dashboard/setting/${item._id}?type=productTypes`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=productTypes");
  };

  return (
    <SettingTable
      title={"Liste des types de produit"}
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
      isLoading={isLoadingProductType}
      data={productTypeData}
    />
  );
};

export default ProductTypeTable;
