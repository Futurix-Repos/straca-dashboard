import { useCallback, useEffect, useState } from "react";
// import { AddClientModal } from "./AddClientModal";
import { BaseUrl } from "@/constants/templates";
import router, { useRouter } from "next/router";
import { GET } from "@/constants/fetchConfig";
import { AddOrderModal } from "./AddOrderModal";
// import DeleteCountryModal from "./SettingComponents/SettingPopups/DeleteCountryModal";

export interface Commande {
    _id: string;
    operation: string;
    details: string;
    contact: string;
    start: string;
    end: string;
    status: string;
}

export const OrderListComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemId, setItemId] = useState("");

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const [modify, setModify] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [selectedOrder, setSelectedOrder] = useState<Commande>();
    const [showModal, setShowModal] = useState(false);

    const toggleShowModal = () => {
        setShowModal(!showModal);
        if (showModal) { setModify(false) }
    }

    const handleModify = (item: Commande) => {
        setModify(true)
        setSelectedOrder(item)
        toggleShowModal()
    }

  


    const [commandesData, setCommandesData] = useState<Commande[]>([]);



    // Function to fetch commandes data
    const fetchCommandesData = useCallback(async () => {
        try {
            const response = await GET(
                `/commandes${searchText.length > 0 ? `?search=${searchText}` : ""}`,
            );

            const data: Commande[] = response;
            // Set the fetched data into state
            setCommandesData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors
        }
    }, [searchText]);

    useEffect(() => {
        fetchCommandesData().finally(() => setLoading(false));
    }, [fetchCommandesData]);

    return (
        <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
            <div className="flex flex-row justify-between items-center">
                <p className="mb-3 font-semibold text-2xl">Gestion des commandes</p>
                <button onClick={() => {}} className="inline-flex h-[48px] items-center justify-center gap-[8px] p-[16px] relative bg-[#3D75B0] rounded-md">
                    <div onClick={() => {
                        router.push("/dashboard/orders?action=new")
                    }} className="relative w-fit mt-[-4.00px] mb-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[18px] tracking-[0] leading-[normal]">
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
                    <div className="flex flex-col rounded-[12px] border-blue-600">
                        <div className="inline-flex flex-col items-start gap-[16px]">
                            <div className="container mx-auto mt-8">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-gray-500">
                                            <th className="py-2 px-4 border-b">Poste</th>
                                            <th className="py-2 px-4 border-b">Type de contrat</th>
                                            <th className="py-2 px-4 border-b">Proximité</th>
                                            <th className="py-2 px-4 border-b">Description</th>
                                            <th className="py-2 px-4 border-b">Date de creation</th>
                                            <th className="py-2 px-4 border-b">Salaire</th>
                                            <th className="py-2 px-4 border-b">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commandesData.map((item) => (
                                            <tr key={item._id}>
                                                <td className="py-2 px-4 border-b">{item.operation}</td>
                                                <td className="py-2 px-4 border-b">{item.details}</td>
                                                <td className="py-2 px-4 border-b">{item.contact}</td>
                                                <td className="py-2 px-4 border-b">{item.start}</td>
                                                <td className="py-2 px-4 border-b">{item.end}</td>
                                                <td className="py-2 px-4 border-b flex justify-center">
                                                    <div className={`px-4 py-2 rounded-3xl items-center justify-center text-center ${item.status.toLocaleLowerCase() === "en cours" ? 'bg-[#DCFCE7]' : "bg-[#FFEDD5]"} ${item.status.toLocaleLowerCase() === "en cours" ? 'text-[#166534]' : "text-[#9A3412]"}`}>{item.status}</div>
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

            <AddOrderModal
                isVisible={showModal}
                onClose={toggleShowModal}
                text="Loading Content Summary"
                isModify={modify}
                selectedOrder={selectedOrder!}
            />

            {/* <AddClientModal
                isVisible={showModal}
                onClose={toggleShowModal}
                type='employee'
                isModify={modify}
                selectedUser={selectedEmployee!}
            />

            <DeleteCountryModal
                isVisible={showDeleteModal}
                onClose={() => { toggleShowDeleteModal() }}
                onYesClick={handleDeleteItem}
            /> */}

        </div>
    );
};