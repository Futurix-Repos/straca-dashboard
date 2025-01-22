import React, { useCallback, useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import { DELETE, GET } from "@/constants/fetchConfig";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { Toast } from "@/constants/toastConfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserType, Vehicle } from "@/constants/types";
import CustomLoader from "@/components/CustomLoader";
import { queryClient } from "@/pages/_app";
import DeliveryStatusBadge from "@/pages/dashboard/components/DeliveryStatusBadge";

const EmployeeListComponent: React.FC = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");

  const handleModify = (item: UserType) => {
    router.push(`/dashboard/partners/edit/${item._id}`);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [itemId, setItemId] = useState("");

  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery<
    UserType[]
  >({
    queryKey: ["employees", searchText],
    queryFn: () =>
      GET(`/employees`, {
        ...(searchText.length > 0 && {
          search: searchText,
        }),
      }),
  });

  const deleteEmployee = useMutation({
    mutationFn: (payload: { id: string }) => DELETE(`/employees/${payload.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      Toast.fire({
        icon: "success",
        title: "Employé supprimé avec succès",
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
  const handleDeleteItem = async () => {
    deleteEmployee.mutate({ id: itemId });
  };

  // Function to fetch commandes data
  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">
          Gestion des collaborateurs
        </p>
        <button className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md">
          <div
            onClick={() => {
              router.push("/dashboard/partners/create");
            }}
            className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]"
          >
            Ajouter un collaborateur
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <p className="mb-3 font-semibold text-2xl">
              Liste des Collaborateurs
            </p>

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

          {isLoadingEmployees ? (
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
                        <th className="py-2 px-4 border-b">Titre</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(employeesData ?? []).length > 0 ? (
                        employeesData?.map((item) => (
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
                              {item.title ? (
                                <div
                                  className={`px-4 py-2 rounded-3xl items-center justify-center text-center ${
                                    item.title.toLocaleLowerCase() === "ceo"
                                      ? "bg-[#DCFCE7]"
                                      : "bg-[#FFEDD5]"
                                  } ${
                                    item.title.toLocaleLowerCase() === "ceo"
                                      ? "text-[#166534]"
                                      : "text-[#9A3412]"
                                  }`}
                                >
                                  {item.title}
                                </div>
                              ) : (
                                <span>-</span>
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
        }}
        onYesClick={handleDeleteItem}
      />
    </div>
  );
};

export default EmployeeListComponent;
