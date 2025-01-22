import React, { useCallback, useEffect, useState } from "react";
import router, { useRouter } from "next/router";

import { DELETE, GET } from "@/constants/fetchConfig";
import { Toast } from "@/constants/toastConfig";
import ConfirmationModal from "@/components/ConfirmationModal";
import CustomLoader from "@/components/CustomLoader";
import { Product, ProductMeasureUnit, Vehicle } from "@/constants/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/pages/_app";

const ProductMeasureUnitList: React.FC = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");

  const handleModify = (item: ProductMeasureUnit) => {
    router.push(`/dashboard/productMeasureUnits/edit/${item._id}`);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: productMeasureUnitsData,
    isLoading: isLoadingProductMeasureUnits,
  } = useQuery<ProductMeasureUnit[]>({
    queryKey: ["productMeasureUnits", searchText],
    queryFn: () =>
      GET(`/productMeasureUnits`, {
        ...(searchText.length > 0 && {
          search: searchText,
        }),
      }),
  });

  const deleteProductMeasureUnit = useMutation({
    mutationFn: (payload: { id: string }) =>
      DELETE(`/productMeasureUnits/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productMeasureUnits"] });
      Toast.fire({
        icon: "success",
        title: "Unité de mesure du produit supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error(`Error deleting:`, error);
      Toast.fire({
        icon: "error",
        title: `Échec de la suppression`,
      });
    },
  });

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [itemId, setItemId] = useState("");
  const handleDeleteItem = async () => {
    deleteProductMeasureUnit.mutate({ id: itemId });
  };

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">
          Gestion des Unités de mesure/Produit
        </p>
        <button
          onClick={() => {
            router.push("/dashboard/productMeasureUnits/create");
          }}
          className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md"
        >
          <div className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]">
            Ajouter
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row w-[60%] justify-between">
              <div className="relative w-[90%]">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Recherche ..."
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {isLoadingProductMeasureUnits ? (
            <CustomLoader />
          ) : (
            <div className="w-full flex flex-col rounded-[12px] border-blue-600">
              <div className="w-full inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8 overflow-auto">
                  <table className="min-w-full text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-2 px-4 border-b">Produit</th>
                        <th className="py-2 px-4 border-b">Montant</th>
                        <th className="py-2 px-4 border-b">Unité de mesure</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(productMeasureUnitsData ?? []).length > 0 ? (
                        productMeasureUnitsData?.map((item) => {
                          return (
                            <tr key={`${item._id}`}>
                              <td className="py-2 px-4 border-b">
                                {item.product.name}
                              </td>
                              <td className="py-2 px-4 border-b ">
                                <div className="max-h-20 overflow-y-auto">
                                  {item.amount}
                                </div>
                              </td>
                              <td className="py-2 px-4 border-b ">
                                {item.measureUnit.label}
                              </td>

                              <td className="py-2 px-4 border-b text-center">
                                <div className="w-full flex flex-row gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      handleModify(item);
                                    }}
                                  >
                                    <i className=" fa-regular fa-pen-to-square text-[#5C73DB]" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setItemId(item._id);
                                      toggleShowDeleteModal();
                                    }}
                                  >
                                    <i className="fa-regular fa-trash-can text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="w-full">
                          <td
                            colSpan={8}
                            className=" h-[60vh] text-center text-2xl"
                          >
                            Pas de données
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={() => {
          toggleShowDeleteModal();
        }}
        onYesClick={handleDeleteItem}
      />
    </div>
  );
};
export default ProductMeasureUnitList;
