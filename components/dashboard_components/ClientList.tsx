import React, { useCallback, useEffect, useState } from "react";
// import { AddClientModal } from "./AddClientModal";
import { BaseUrl } from "@/constants/templates";
import router, { useRouter } from "next/router";
import { DELETE, GET } from "@/constants/fetchConfig";
import DeleteCountryModal from "./SettingComponents/SettingPopups/DeleteCountryModal";
import { Toast } from "@/constants/toastConfig";
// import DeleteCountryModal from "./SettingComponents/SettingPopups/DeleteCountryModal";

export interface Client {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    type: "client";
}

interface props{
    setSelectedClient: (client: Client) => void;
}
export const ClientListComponent: React.FC<props> = ({setSelectedClient}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [modify, setModify] = useState(false);
    const [searchText, setSearchText] = useState("");
    const handleModify = (item: Client) => {
        setSelectedClient(item);
        router.push('/dashboard/clients?action=edit');
    }



    const [ClientsData, setClientsData] = useState<Client[]>([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }

    const [itemId, setItemId] = useState("")


    const handleDeleteItem = async () => {
        try {
            console.log(`Deleting Client with ID: ${itemId}`);
            const response = await DELETE(`/clients/${itemId}`);
            
              router.reload();
              Toast.fire({
                icon: "success",
                title: `Supprimé avec succès`,
              });

        } catch (error) {
            console.error(`Error deleting:`, error);
            Toast.fire({
                icon: "error",
                title: `Échec de la suppression`,
              });
        }
    };

    // Function to fetch commandes data
    const fetchClientsData = useCallback(async () => {
        try {
            const response = await GET(
                `/clients${searchText.length > 0 ? `?search=${searchText}` : ""}`,
            );

            const data: Client[] = response;
            // Set the fetched data into state
            setClientsData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors
        }
    }, [searchText]);

    useEffect(() => {
        fetchClientsData().finally(() => setLoading(false));
    }, [fetchClientsData]);
    return (
        <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
            <div className="flex flex-row justify-between items-center">
                <p className="mb-3 font-semibold text-2xl">Gestion des clients</p>
                <button className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md">
                    <div onClick={() => {
                        router.push("/dashboard/clients?action=new")
                    }} className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]">
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
                    <div className="flex flex-col rounded-[12px] border-blue-600">
                        <div className="inline-flex flex-col items-start gap-[16px]">
                            <div className="container mx-auto mt-8">
                                <table className="min-w-full">
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
                                        {ClientsData.map((item) => (
                                            <tr key={item._id}>
                                                <td className="py-2 px-4 border-b">{item.lastName}</td>
                                                <td className="py-2 px-4 border-b">{item.firstName}</td>
                                                <td className="py-2 px-4 border-b">{item.email}</td>
                                                <td className="py-2 px-4 border-b">{item.phone}</td>
                                                <td className="py-2 px-4 border-b flex justify-center">
                                                    <div className={`px-3 py-1 rounded-3xl items-center justify-center text-center ${item.company === "CASHLESS" ? 'bg-[#DCFCE7]' : "bg-[#FFEDD5]"} ${item.company === "CASHLESS" ? 'text-[#166534]' : "text-[#9A3412]"}`}>{item.company ?? "NULL"}</div>
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {/* Add your action buttons or links here */}
                                                    <i onClick={() => { setItemId(item._id); toggleShowDeleteModal() }} className="fa-regular fa-trash-can text-red-600"></i>
                                                    <i onClick={() => handleModify(item)} className="ml-4 fa-regular fa-pen-to-square text-[#5C73DB]"></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteCountryModal
                isVisible={showDeleteModal}
                onClose={() => { toggleShowDeleteModal() }}
                onYesClick={handleDeleteItem}
            /> 
            

        </div>
    );
};
export default ClientListComponent;