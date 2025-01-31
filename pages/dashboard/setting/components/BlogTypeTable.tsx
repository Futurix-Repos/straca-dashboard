import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BlogType, SettingElemType, ProductType } from "@/constants/types";
import { DELETE, GET } from "@/constants/fetchConfig";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { useSettings } from "@/context/settingscontext";
import SettingTable from "@/pages/dashboard/setting/components/SettingTable";
import DeliveryStatusBadge from "@/pages/dashboard/components/DeliveryStatusBadge";

const BlogTypeTable = () => {
  const router = useRouter();
  const { setSelectedBlogType } = useSettings();

  const [search, setSearch] = useState("");

  //====== Blog type =====
  const { data: blogTypeData, isLoading: isLoadingBlogType } =
    useQuery<BlogType>({
      queryKey: ["blogTypes", search],
      queryFn: () =>
        GET(`/blogTypes`, {
          ...(search.length > 0 && {
            search: search,
          }),
        }),
    });

  const deleteBlogType = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/blogTypes/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogTypes"] });
      Toast.fire({
        icon: "success",
        title: "Catégorie de blog supprimée avec succès",
      });
    },
  });
  //====== Blog type =====

  const handleDelete = ({ itemId }: { itemId: any }) => {
    deleteBlogType.mutate({ id: itemId });
  };
  const handleModify = ({ item }: { item: any }) => {
    router.push(`/dashboard/setting/${item._id}?type=blogTypes`);
  };

  const handleCreate = () => {
    router.push("/dashboard/setting/create?type=blogTypes");
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
      isLoading={isLoadingBlogType}
      data={blogTypeData}
    />
  );
};

export default BlogTypeTable;
