import React, { useState } from "react";
// import { AddClientModal } from "./AddClientModal";
import { useRouter } from "next/router";
import { DELETE, GET } from "@/constants/fetchConfig";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Order, OrderStatus } from "@/constants/types";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import CustomLoader from "@/components/CustomLoader";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import OrderStatusBadge from "@/pages/dashboard/components/OrderStatusBadge";

const OrderListComponent = () => {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemId, setItemId] = useState("");

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [modify, setModify] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["orders", searchText],
    queryFn: () =>
      GET(`/orders`, {
        ...(searchText.length > 0 && {
          search: searchText,
        }),
      }),
  });

  const deleteOrder = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/orders/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      Toast.fire({
        icon: "success",
        title: "Commande supprimée avec succès",
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

  const toggleShowModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setModify(false);
    }
  };

  const handleModify = (item: Order) => {
    console.log("modify");
  };

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">Gestion des commandes</p>
        <button
          onClick={() => {}}
          className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md"
        >
          <div
            onClick={() => {
              router.push("/dashboard/orders/create");
            }}
            className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]"
          >
            Ajouter un commande
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">Liste des commandes</p>
            </div>
            <div className="relative w-[50%]">
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
          {/* Table */}
          {isLoadingOrders ? (
            <CustomLoader />
          ) : (
            <div className="w-full flex flex-col rounded-[12px] border-blue-600">
              <div className="w-full inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8 overflow-auto">
                  <table className="min-w-full text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-2 px-4 border-b">Référence</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Produits</th>
                        <th className="py-2 px-4 border-b">(Remise/Hausse)</th>
                        <th className="py-2 px-4 border-b">
                          {"Montant total"}
                        </th>
                        <th className="py-2 px-4 border-b">Voyages</th>
                        <th className="py-2 px-4 border-b">Date de début</th>
                        <th className="py-2 px-4 border-b">{"Date de fin"}</th>
                        <th className="py-2 px-4 border-b">Client</th>
                        <th className="py-2 px-4 border-b">
                          {"Adresse d'arrivé"}
                        </th>
                        <th className="py-2 px-4 border-b">{"Crée par "}</th>
                        <th className="py-2 px-4 border-b">
                          {"Date de modification"}
                        </th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(ordersData ?? []).length > 0 ? (
                        ordersData?.map((item) => (
                          <tr key={item._id}>
                            <td className="py-2 px-4 border-b">
                              {item.reference ?? "-"}
                            </td>
                            <td className="py-2 px-4 border-b ">
                              <div className="max-h-20 overflow-y-auto">
                                {item.description}
                              </div>
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.status ? (
                                <OrderStatusBadge status={item.status} />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.items.length}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.items.some(
                                (elem) => elem.extra !== undefined,
                              )
                                ? "OUI"
                                : "NON"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.totalAmount} F CFA
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item?.deliveries?.length ?? 0}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {format(item.startDate, "dd/MM/yyyy", {
                                locale: fr,
                              })}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {format(item.endDate, "dd/MM/yyyy", {
                                locale: fr,
                              })}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.client
                                ? `${item.client.lastName} ${item.client.firstName}`
                                : "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.arrivalAddress?.name ?? "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.createdBy
                                ? `${item.createdBy.lastName} ${item.createdBy.firstName}`
                                : "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {format(item.updatedAt, "dd/MM/yyyy", {
                                locale: fr,
                              })}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {/* Add your action buttons or links here */}
                              <i
                                onClick={() => {
                                  setItemId(item._id);
                                  toggleShowDeleteModal();
                                }}
                                className="fa-regular fa-trash-can text-red-600"
                              ></i>
                              <i
                                onClick={() => handleModify(item)}
                                className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB]"
                              ></i>
                            </td>
                          </tr>
                        ))
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
    </div>
  );
};

export default OrderListComponent;
