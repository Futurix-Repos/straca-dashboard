import React, { useState } from "react";
// import { AddClientModal } from "./AddClientModal";
import { useRouter } from "next/router";
import { DELETE, GET, PUT } from "@/constants/fetchConfig";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Delivery,
  DeliverySenderReceiver,
  Order,
  OrderStatus,
  ProductMeasureUnit,
} from "@/constants/types";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";
import CustomLoader from "@/components/CustomLoader";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Loader2 } from "lucide-react";
import DeliveryStatusBadge from "@/pages/dashboard/components/DeliveryStatusBadge";

const ActorInfos = ({
  deliveryId,
  sender,
  receiver,
  type,
  productMeasureUnit,
}: {
  deliveryId: string;
  sender?: DeliverySenderReceiver;
  receiver?: DeliverySenderReceiver;
  type: "sender" | "receiver";
  productMeasureUnit: ProductMeasureUnit;
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const actor = type === "sender" ? sender : receiver;
  const secondActor = type === "sender" ? receiver : sender;

  const confirmActors = useMutation({
    mutationFn: (payload: { id: string; role: "sender" | "receiver" }) =>
      PUT(`/deliveries/confirm/${payload.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      Toast.fire({
        icon: "success",
        title: "Acteur confirmé avec succès",
      });
    },
    onError: (error) => {
      console.error(`Error deleting:`, error);
      Toast.fire({
        icon: "error",
        title: `Échec de la confirmation`,
      });
    },
  });

  const handleConfirmItem = async () => {
    confirmActors.mutate({ id: deliveryId, role: type });
  };

  return actor?.user === null ? (
    <div className="flex items-center justify-center">
      <span className="">
        Pas {type === "sender" ? "d'émetteur" : "de receveur"}, veuillez
        patienter le prochain pointage
      </span>
    </div>
  ) : (
    <div className="py-4 flex flex-col gap-2">
      <div className="flex flex-row items-center gap-7">
        <h3 className="text-xl font-semibold">
          {type === "sender" ? "Émetteur" : "Receveur"}
        </h3>
        {actor?.validateBy ? (
          <LuBadgeCheck className="text-green-600 h-6 w-6" />
        ) : (
          <LuBadgeX className="text-red-600 h-6 w-6" />
        )}
      </div>
      <div className="flex flex-row gap-7  text-start  text-base">
        <span className="min-w-28">Nom</span>
        <span className="font-bold">
          {actor?.user.firstName} {actor?.user.lastName}
        </span>
      </div>
      <div className="flex flex-row  gap-7 text-start text-base">
        <span className="min-w-28">Quantité</span>
        <span className="font-bold">
          {actor?.quantity} {productMeasureUnit.measureUnit.label}
        </span>
      </div>
      <div className="flex flex-row  gap-7 text-start text-base">
        <span className="min-w-28">Note</span>
        <span className="font-bold">{actor?.note}</span>
      </div>
      {actor?.validateBy === null && secondActor?.validateBy === null ? (
        <Button
          className=" w-32 mt-3 inline-flex text-center justify-center items-center gap-2 rounded-md bg-secondary py-1 px-3 text-sm/6 font-semibold text-white "
          onClick={() => {
            setShowConfirmModal((prevState) => !prevState);
          }}
          disabled={confirmActors.isPending}
        >
          Confirmer
          {confirmActors.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </Button>
      ) : (
        actor?.validateBy !== null && (
          <div className="flex flex-row  gap-7 text-start text-base">
            <span className="min-w-28">Confirmée par</span>
            <span className="font-bold">
              {actor?.validateBy?.firstName ?? "-"}{" "}
              {actor?.validateBy?.lastName ?? "-"}
            </span>
          </div>
        )
      )}
      <ConfirmationModal
        title={
          "Cette action est irréversible. Êtes vous sur de vouloir confirmer ses données ?"
        }
        isVisible={showConfirmModal}
        onClose={() => {
          setShowConfirmModal((prevState) => !prevState);
        }}
        onYesClick={handleConfirmItem}
      />
    </div>
  );
};

export function ActorsModal({
  sender,
  receiver,
  productMeasureUnit,
  deliveryId,
}: {
  deliveryId: string;
  sender?: DeliverySenderReceiver;
  receiver?: DeliverySenderReceiver;
  productMeasureUnit: ProductMeasureUnit;
}) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={open}
        className="min-w-32 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white focus:outline-none "
      >
        Voir acteurs
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-50 w-screen  overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-2xl  lg:max-h-[60vh] max-h-[80vh] overflow-auto rounded-xl bg-white shadow-md p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h6" className="text-2xl font-medium text-black">
                Acteurs de la livraison
              </DialogTitle>
              <p className="mt-2 text-base text-black">
                Veuillez confirmer les données remplies par les acteurs de la
                livraison
              </p>
              <div className="mt-4 flex flex-col gap-5  divide-y-2  text-black">
                <ActorInfos
                  sender={sender}
                  receiver={receiver}
                  type={"sender"}
                  productMeasureUnit={productMeasureUnit}
                  deliveryId={deliveryId}
                />
                <ActorInfos
                  sender={sender}
                  receiver={receiver}
                  type={"receiver"}
                  productMeasureUnit={productMeasureUnit}
                  deliveryId={deliveryId}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export const DeliveryListComponent = () => {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemId, setItemId] = useState("");

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [searchText, setSearchText] = useState("");

  const { data: deliveriesData, isLoading: isLoadingDeliveries } = useQuery<
    Delivery[]
  >({
    queryKey: ["deliveries", searchText],
    queryFn: () =>
      GET(`/deliveries`, {
        ...(searchText.length > 0 && {
          search: searchText,
        }),
      }),
  });

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
          {isLoadingDeliveries ? (
            <CustomLoader />
          ) : (
            <div className="w-full flex flex-col rounded-[12px] border-blue-600">
              <div className="w-full inline-flex flex-col items-start gap-[16px]">
                <div className="container mx-auto mt-8 overflow-auto">
                  <table className="min-w-full text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-2 px-4 border-b">Référence</th>
                        <th className="py-2 px-4 border-b">
                          {"Site d'expédition"}
                        </th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Véhicule</th>
                        <th className="py-2 px-4 border-b">Commande</th>
                        <th className="py-2 px-4 border-b">Produit</th>

                        <th className="py-2 px-4 border-b">
                          {"Date de création"}
                        </th>
                        <th className="py-2 px-4 border-b">
                          {"Date de modification"}
                        </th>
                        <th className="py-2 px-4 border-b">Acteurs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(deliveriesData ?? []).length > 0 ? (
                        deliveriesData?.map((item) => (
                          <tr key={item._id}>
                            <td className="py-2 px-4 border-b">
                              {item.reference ?? "-"}
                            </td>
                            <td className="py-2 px-4 border-b ">
                              <div className="max-h-20 overflow-y-auto">
                                {item.departureAddress?.label ?? "-"}
                              </div>
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.status ? (
                                <DeliveryStatusBadge status={item.status} />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.vehicle?.name ?? "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.order?.reference ?? "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.productMeasureUnit
                                ? `${item.productMeasureUnit.product.name} - ${item.productMeasureUnit.measureUnit.label}`
                                : "-"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {format(item.createdAt, "dd/MM/yyyy", {
                                locale: fr,
                              })}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {format(item.updatedAt, "dd/MM/yyyy", {
                                locale: fr,
                              })}
                            </td>

                            <td className="py-2 px-4 border-b">
                              <ActorsModal
                                deliveryId={item._id}
                                sender={item.sender}
                                receiver={item.receiver}
                                productMeasureUnit={item.productMeasureUnit}
                              />
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

export default DeliveryListComponent;
