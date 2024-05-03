import { useCallback, useEffect, useState } from "react";
// import { AddClientModal } from "./AddClientModal";
import { BaseUrl } from "@/constants/templates";
import router, { useRouter } from "next/router";
import BlogGridCard from "@/pages/dashboard/blogs/BlogGridCard";
import { DELETE, GET } from "@/constants/fetchConfig";
import { Toast } from "@/constants/toastConfig";
import DeleteCountryModal from "@/components/dashboard_components/SettingComponents/SettingPopups/DeleteCountryModal";
import CustomLoader from "@/components/CustomLoader";
import { User } from "@/components/dashboard_components/users-permissions/UsersPermissionsList";

export interface Tracking {
  _id: string;
  name: string;
  brand: string;
  type: string;
  registrationNumber: string;
  createdAt: string;
  orderId: string;
  createdBy: User | null;
}
interface props {
  setSelectedTracking: (item: Tracking) => void;
}

export const TrackingListComponent: React.FC<props> = ({ setSelectedTracking}) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [modify, setModify] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setModify(false);
    }
  };

  const handleModify = (item: Tracking) => {
    setSelectedTracking(item);
    router.push("/dashboard/tracking?action=edit");
  };

  const [trackingData, setTrackingData] = useState<Tracking[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [itemId, setItemId] = useState("");


  const handleDeleteItem = async () => {
    try {
      console.log(`Deleting tracking with ID: ${itemId}`);
      const response = await DELETE(`/tracking/${itemId}`);

      Toast.fire({
        icon: "success",
        title: `Supprimé avec succès`,
    });
      router.reload();
    } catch (error) {
      console.error(`Error deleting:`, error);
      Toast.fire({
        icon: "error",
        title: `Échec de la suppression`,
    });
    }
  };

  // Function to fetch commandes data
  const fetchTrackingData = useCallback(async () => {
    try {
      const response = await GET(
        `/tracking${searchText.length > 0 ? `?search=${searchText}` : ""}`
      );
console.log(response.body);
      const data: Tracking[] = response;
      // Set the fetched data into state
      setTrackingData(data);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: {error},
      });
      console.error("Error fetching data:", error);
      // Handle errors
    }
  }, [searchText]);

  useEffect(() => {
    fetchTrackingData().finally(() => setLoading(false));
  }, [fetchTrackingData]);

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-3 font-semibold text-2xl">Gestion des Fleets</p>
        <button
          onClick={toggleShowModal}
          className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md"
        >
          <div
            onClick={() => {
              router.push("/dashboard/tracking?action=new");
            }}
            className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]"
          >
            Ajouter un gestion de flotte
          </div>
          <i className="fa-solid fa-plus ml-1 text-white"></i>
        </button>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">Liste des gestion de flotte</p>
            </div>
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

          {loading ? (
            <CustomLoader />
          ) : (
            <div className="flex flex-col rounded-[12px] border-blue-600">
              <div className="inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="py-2 px-4 border-b">Suivi Id</th>
                          <th className="py-2 px-4 border-b">Nom</th>
                          <th className="py-2 px-4 border-b">Type</th>
                          <th className="py-2 px-4 border-b">N Imatriculation</th>
                          <th className="py-2 px-4 border-b">
                            Marque
                          </th>
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          trackingData.map((item) => {
                            return (
                              <tr key={item._id}>
                                <td className="py-2 px-4 border-b">{item._id}</td>
                                <td className="py-2 px-4 border-b">
                                  {item.name}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  {item.type}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  {item.registrationNumber}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  {item.brand}
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
                                    onClick={() => {
                                      handleModify(item);
                                    }}
                                    className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB]"
                                  ></i>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <AddClientModal
                isVisible={showModal}
                onClose={toggleShowModal}
                type='employee'
                isModify={modify}
                selectedUser={selectedEmployee!}
            />
            */}
      <DeleteCountryModal
        isVisible={showDeleteModal}
        onClose={() => {
          toggleShowDeleteModal();
        }}
        onYesClick={handleDeleteItem}
      />
    </div>
  );
};
