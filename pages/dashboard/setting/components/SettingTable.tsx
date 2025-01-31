import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import CustomLoader from "@/components/CustomLoader";
import { DELETE, GET } from "@/constants/fetchConfig";
import { useSettings } from "@/context/settingscontext";
import { useRouter } from "next/router";
import { Toast } from "@/constants/toastConfig";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import {
  MeasureUnit,
  ProductMeasureUnit,
  SettingElemType,
} from "@/constants/types";

export interface BlogType {
  _id: string;
  label: string;
  description: string;
  slug: string;
}
const SettingTable = ({
  type,
  title,
  handleDelete,
  handleModify,
  handleCreate,
  setSearchText,
  isLoading,
  data,
}: {
  type?: SettingElemType;
  title: string;
  handleDelete: (itemId: string) => void;
  handleModify: (item: any) => void;
  handleCreate: () => void;
  setSearchText: (search: string) => void;
  isLoading: boolean;
  data: any;
}) => {
  const [itemId, setItemId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <div className="w-full mr-10 px-4 py-7 bg-white rounded-[12px]">
      <div className="rounded-[12px] border-blue-600">
        <div className="mb-3 flex flex-row justify-between top-[31px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-800 text-[18px] tracking-[0] leading-[normal]">
          {title}
          <button
            onClick={() => {
              handleCreate();
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
          <div className="w-full inline-flex flex-col items-start gap-[16px]">
            <div className="container mx-auto mt-8 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-4 border-b">Libellé</th>
                    <th className="py-2 px-4 border-b ">Description</th>
                    {type === "vehicleModels" && (
                      <th className="py-2 px-4 border-b ">Marque</th>
                    )}
                    {type === "products" && (
                      <th className="py-2 px-4 border-b ">Type de produit</th>
                    )}
                    {type === "products" && (
                      <th className="py-2 px-4 border-b ">Unités de mesure</th>
                    )}
                    <th className="py-2 px-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data ?? "").length > 0 ? (
                    data.map((item: any) => (
                      <tr key={item._id} className="text-sm">
                        <td className="py-2 px-4 border-b">
                          {item.label ?? item.name}
                        </td>
                        <td className="py-2 px-4 border-b ">
                          <div className="max-h-20 overflow-y-auto">
                            {item.description}
                          </div>
                        </td>
                        {type === "vehicleModels" && (
                          <td className="py-2 px-4 border-b ">
                            {item.brand.label}
                          </td>
                        )}
                        {type === "products" && (
                          <td className="py-2 px-4 border-b ">
                            {item.productType.label}
                          </td>
                        )}
                        {type === "products" && (
                          <td className="py-2 px-4 border-b ">
                            <div className="max-h-20 overflow-y-auto">
                              {item.measureUnits
                                .map(
                                  (t: ProductMeasureUnit) =>
                                    t.measureUnit.label,
                                )
                                .join(", ")}
                            </div>
                          </td>
                        )}
                        <td className="py-2 px-4 border-b ">
                          <div className="flex flex-col gap-2">
                            {/* Add your action buttons or links here */}
                            <button
                              onClick={() => {
                                handleModify(item);
                              }}
                              className=" h-8 px-4 rounded-lg border border-indigo-500 justify-center items-center inline-flex"
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
                              className=" h-8 px-4 bg-red-600 rounded-lg justify-center items-center inline-flex"
                            >
                              <div className="text-white text-xs font-medium font-['Inter']">
                                Supprimer
                              </div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="h-[30vh] text-center">
                        Pas de données
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
      </div>
      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={toggleShowDeleteModal}
        onYesClick={() => {
          if (itemId.length > 0) handleDelete(itemId);
        }}
      ></ConfirmationModal>
    </div>
  );
};

export default SettingTable;
