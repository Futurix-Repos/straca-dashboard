import React, { useCallback, useEffect, useState } from "react";

import CustomLoader from "@/components/CustomLoader";
import { DELETE, GET } from "@/constants/fetchConfig";
import { useSettings } from "@/context/settingscontext";
import { useRouter } from "next/router";
import { Toast } from "@/constants/toastConfig";
import DeleteCountryModal from "./SettingPopups/DeleteCountryModal";

export interface Proximity {
  _id: string;
  label: string;
  description: string;
}
export const ProximityCard: React.FC = ({ }) => {
  const router = useRouter();
  const { action } = router.query;
  const [proximityData, setProximityData] = useState<Proximity[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedProximity } = useSettings();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemId, setItemId] = useState("");
  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const fetchProximities = useCallback(async () => {
    try {
      const response = await GET(
        `/proximity${searchText.length > 0 ? `?search=${searchText}` : ""}`
      );
      console.log(
        `/proximity${searchText.length > 0 ? `?search=${searchText}` : ""}`
      );
      const data: Proximity[] = response;
      setProximityData(data);
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage = error.response.data.error.message;
      console.log(errorMessage);
      return Toast.fire({
        icon: "error",
        title: `Error: ${errorMessage}`,
      });
    }
  }, [searchText]);

  useEffect(() => {
    fetchProximities().finally(() => setIsLoading(false));
  }, [fetchProximities]);

  const handleModify = (item: Proximity) => {
    setSelectedProximity(item);
    router.push("/dashboard/setting?action=edit&type=proximity");
  };
  const handleDelete = async () => {
    try {
      await DELETE(`/proximity/${itemId}`);
      Toast.fire({
        icon: "success",
        title: "Catégorie de proximité supprimée avec succès",
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="w-1/2 mr-10 px-4 py-3 pb-10 bg-white rounded-[12px]">
      <div className="rounded-[12px] border-blue-600">
        <div className="mb-3 flex flex-row justify-between top-[31px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-800 text-[18px] tracking-[0] leading-[normal]">
          Catégorie d’article de Proximité
          <button
            onClick={() => {
              router.push("/dashboard/setting?action=new&type=proximity");
            }}
            className="px-4 py-3 [font-family:'Inter-Regular',Helvetica] font-normal text-[#ffffff] text-sm tracking-[0] leading-[normal] bg-[#4763E4] items-center rounded-xl"
          >
            Ajouter
            <i className="fa-solid fa-plus ml-1"></i>
          </button>
        </div>
        <div className="flex">
          <input
            type="search"
            id="default-search"
            className="block w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Recherche ..."
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>

        {isLoading ? (
          <CustomLoader />
        ) : (
          <div className="inline-flex flex-col items-start gap-[16px]">
            <div className="container mx-auto mt-8">
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-4 border-b">Libellé</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {proximityData.map((item) => (
                    <tr key={item._id} className="text-sm">
                      <td className="py-2 px-4 border-b">{item.label}</td>
                      <td className="py-2 px-4 border-b">{item.description}</td>
                      <td className="py-2 px-4 border-b">
                        {/* Add your action buttons or links here */}
                        <button
                          onClick={() => {
                            handleModify(item);
                          }}
                          className="h-8 px-4 rounded-lg border border-indigo-500 justify-center items-center inline-flex"
                        >
                          <div className="text-indigo-500 text-xs font-medium font-['Inter']">
                            Modifier
                          </div>
                        </button>
                        <button
                          onClick={() => {

                            setItemId(item._id);
                            toggleShowDeleteModal();
                          }}
                          className="ml-4 h-8 px-4 bg-red-600 rounded-lg justify-center items-center inline-flex"
                        >
                          <div className="text-white text-xs font-medium font-['Inter']">
                            Supprimer
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
      </div>
      <DeleteCountryModal
        isVisible={showDeleteModal}
        onClose={toggleShowDeleteModal}
        onYesClick={handleDelete}
      ></DeleteCountryModal>
    </div>
  );
};

export default ProximityCard;
