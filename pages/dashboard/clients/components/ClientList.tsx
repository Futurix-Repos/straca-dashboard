import React, { useCallback, useEffect, useState } from "react";

import router, { useRouter } from "next/router";
import { DELETE, GET, PUT } from "@/constants/fetchConfig";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { Toast } from "@/constants/toastConfig";
import CustomLoader from "@/components/CustomLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserType } from "@/constants/types";
import { queryClient } from "@/pages/_app";
import clsx from "clsx";

const ClientListComponent: React.FC = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const handleModify = (item: UserType) => {
    router.push(`/dashboard/clients/edit/${item._id}`);
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [itemId, setItemId] = useState("");

  const { data: clientsData, isLoading: isLoadingClients } = useQuery<
    UserType[]
  >({
    queryKey: ["clients", searchText],
    queryFn: () =>
      GET(`/clients`, {
        ...(searchText.length > 0 && {
          search: searchText,
        }),
      }),
  });

  const confirmClient = useMutation({
    mutationFn: (payload: { id: string }) =>
      PUT(`/clients/activate/${payload.id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      Toast.fire({
        icon: "success",
        title: "Client activé avec succès",
      });
    },
    onError: (error) => {
      console.error(`Error deleting:`, error);
      Toast.fire({
        icon: "error",
        title: `Échec de l'activation`,
      });
    },
  });

  const deleteClient = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/clients/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      Toast.fire({
        icon: "success",
        title: "Client supprimé avec succès",
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

  const handleConfirmItem = async () => {
    confirmClient.mutate({ id: itemId });
  };
  const handleDeleteItem = async () => {
    deleteClient.mutate({ id: itemId });
  };

  // Function to fetch commandes data

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">Gestion des clients</p>
        <button className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md">
          <div
            onClick={() => {
              router.push("/dashboard/clients/create");
            }}
            className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]"
          >
            Ajouter un client
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <p className="mb-3 font-semibold text-2xl">Liste des Clients</p>

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
          {isLoadingClients ? (
            <CustomLoader />
          ) : (
            <div className="w-full flex flex-col rounded-[12px] border-blue-600">
              <div className="w-full inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8 overflow-auto">
                  <table className="min-w-full text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-2 px-4 border-b">Noms</th>
                        <th className="py-2 px-4 border-b">Prénoms</th>
                        <th className="py-2 px-4 border-b">E-mails</th>
                        <th className="py-2 px-4 border-b">Téléphone</th>
                        <th className="py-2 px-4 border-b">Entreprise</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(clientsData ?? []).length > 0 ? (
                        clientsData?.map((item) => (
                          <tr key={item._id}>
                            <td className="py-2 px-4 border-b">
                              {item.lastName}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.firstName}
                            </td>
                            <td className="py-2 px-4 border-b">{item.email}</td>
                            <td className="py-2 px-4 border-b">{item.phone}</td>
                            <td className="py-2 px-4 border-b flex justify-center">
                              {item.company ? (
                                <div
                                  className={`px-3 py-1 rounded-3xl items-center justify-center text-center bg-[#DCFCE7] text-[#166534]`}
                                >
                                  {item.company}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {/* Add your action buttons or links here */}
                              <button
                                onClick={() => {
                                  setItemId(item._id);
                                  toggleShowDeleteModal();
                                }}
                              >
                                <i className="fa-regular fa-trash-can text-red-600" />
                              </button>

                              <button onClick={() => handleModify(item)}>
                                <i className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB]" />
                              </button>
                              {
                                <button
                                  disabled={item.confirmed}
                                  onClick={() => {
                                    setItemId(item._id);
                                    setShowConfirmModal(
                                      (prevState) => !prevState,
                                    );
                                  }}
                                >
                                  <i
                                    className={clsx(
                                      item.confirmed
                                        ? "text-green-600"
                                        : "text-black",
                                      "ml-4 fa-regular fa-regular fa-circle-check ",
                                    )}
                                  />
                                </button>
                              }
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

      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={() => {
          toggleShowDeleteModal();
          setItemId("");
        }}
        onYesClick={handleDeleteItem}
      />

      <ConfirmationModal
        title={"Êtes vous sur de vouloir confirmer ce client ?"}
        isVisible={showConfirmModal}
        onClose={() => {
          setShowConfirmModal((prevState) => !prevState);
          setItemId("");
        }}
        onYesClick={handleConfirmItem}
      />
    </div>
  );
};
export default ClientListComponent;
