import { renderInputField } from "@/components/InputComponents/InputComponents";
import DropdownComponent from "@/components/InputComponents/dropdowncomponent";

import {
  BlogType,
  NullableAddress,
  NullableOrderItem,
  NullableOrderItemWithId,
  OrderStatus,
  ProductMeasureUnit,
  ProductType,
  UserType,
  VehicleType,
} from "@/constants/types";
import { GET, POST } from "@/constants/fetchConfig";
import { ADD_ORDER_INPUTS } from "@/constants/templates";
import router from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { ClientSelect } from "@/components/InputComponents/ClientSelect";
import { CustomDateInput } from "@/components/InputComponents/CustomDateInput";
import {
  Button,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
  Textarea,
} from "@headlessui/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { fr } from "date-fns/locale";
import { Calendar } from "@/components/InputComponents/Calendar";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { extraTypeToFrench, orderStatusToFrench } from "@/constants/helpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductMeasureUnitSelect } from "@/components/InputComponents/ProductMeasureUnitSelect";
import { NumericFormat } from "react-number-format";
import CustomLoader from "@/components/CustomLoader";
import MapWrapper from "@/pages/dashboard/orders/components/MapComponent";
import { queryClient } from "@/pages/_app";
import { Toast } from "@/constants/toastConfig";

const OrderItemComponent = ({
  data,
  isDataLoading,
  item,
  setItem,
  search,
  setSearch,
  itemIsDisabled,
}: {
  data?: ProductMeasureUnit[];
  isDataLoading: boolean;
  item: NullableOrderItemWithId;
  setItem: (value: NullableOrderItemWithId) => void;
  search: string;
  setSearch: (value: string) => void;
  itemIsDisabled: (productMeasureUnit: ProductMeasureUnit) => boolean;
}) => {
  return (
    <div className="py-7 flex flex-col gap-2 items-start">
      <div className="flex flex-col lg:flex-row w-full items-end gap-4">
        <div className="w-full">
          <ProductMeasureUnitSelect
            selectedProductMeasureUnit={item.productMeasureUnit ?? null}
            setSelectedProductMeasureUnit={(productMeasure) => {
              setItem({
                ...item,
                productMeasureUnit: productMeasure ?? undefined,
                quantity: 1,
                totalAmount: productMeasure?.amount,
                extra: item.extra
                  ? {
                      type: item.extra?.type ?? "",
                      value: item.extra?.value ?? 0,
                    }
                  : undefined,
              });
            }}
            data={data}
            isLoading={isDataLoading}
            search={search}
            setSearch={setSearch}
            itemIsDisabled={itemIsDisabled}
          />
        </div>
        <div className="flex flex-col gap-1 text-base w-full">
          <label>Montant</label>
          <NumericFormat
            readOnly={true}
            allowNegative={false}
            placeholder="Veuillez entrer le montant"
            thousandSeparator={" "}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-0 sm:text-sm sm:leading-6"
            value={item.totalAmount ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1 text-base w-[30%]">
          <label>Quantité</label>
          <NumericFormat
            disabled={item.productMeasureUnit === undefined}
            allowNegative={false}
            min={item.productMeasureUnit !== undefined ? 1 : undefined}
            placeholder="Veuillez entrer la quantité"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-0 sm:text-sm sm:leading-6"
            value={item.quantity ?? 0}
            onValueChange={(values) => {
              if (item.productMeasureUnit !== undefined) {
                const quantity = Number(values.value);
                const totalAmount = item.productMeasureUnit?.amount ?? 0;
                setItem({
                  ...item,
                  quantity: quantity,
                  totalAmount: quantity * totalAmount,
                });
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full items-end gap-4">
        <div className="flex flex-col gap-1 text-base w-full">
          <label>{"Type d'extra"}</label>
          <Listbox
            value={item.extra?.type ?? ""}
            onChange={(value) => {
              if (item.productMeasureUnit !== undefined) {
                setItem({
                  ...item,
                  extra: {
                    type: value,
                    value: item.extra?.value ?? 0,
                  },
                });
              }
            }}
          >
            <ListboxButton
              disabled={item.productMeasureUnit === undefined}
              className="w-full justify-start text-left flex flex-row items-center gap-2 text-base font-semibold text-black bg-white border p-1.5 rounded-md"
            >
              {item.extra?.type
                ? extraTypeToFrench(item.extra?.type)
                : "Veuillez sélectionner un type"}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="w-[var(--button-width)] text-black z-50   p-3 border border-gray-100 shadow-md rounded-xl bg-white text-base transition duration-200 ease-in-out"
            >
              {["RISE", "DISCOUNT"].map((extra) => (
                <ListboxOption
                  key={extra}
                  value={extra}
                  className="data-[focus]:bg-gray-100 p-1 rounded-md"
                >
                  {extraTypeToFrench(extra as "RISE" | "DISCOUNT")}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <div className="flex flex-col gap-1 text-base w-full">
          <label>Valeur</label>
          <NumericFormat
            disabled={item.productMeasureUnit === undefined}
            allowNegative={false}
            isAllowed={(inputObj) => {
              const value = Number(inputObj.floatValue ?? "0");

              if (item.extra?.type === "RISE") {
                return value <= 1000;
              } else return value <= 100;
            }}
            placeholder="Veuillez entrer la valeur"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-0 sm:text-sm sm:leading-6"
            value={item.extra?.value ?? 0}
            onValueChange={(values) => {
              if (item.productMeasureUnit !== null) {
                setItem({
                  ...item,
                  extra: {
                    type: item.extra?.type ?? undefined,
                    value: Number(values.value),
                  },
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const OrderForm = ({ action }: { action: "create" | "edit" }) => {
  const [query, setQuery] = useState("");
  const [client, setClient] = useState<UserType | null>(null);

  const orderStatusArray = Object.values(OrderStatus).map((status) => ({
    name: status,
    disabled: action === "create" && status !== "INITIATED",
  }));
  const extraTypeArray = ["RISE", "DISCOUNT"].map((extra) => ({
    name: extra,
    disabled: false,
  }));

  const [status, setStatus] = useState<
    { name: OrderStatus; disabled: boolean } | undefined
  >();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [items, setItems] = useState<NullableOrderItemWithId[]>([]);
  const [description, setDescription] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [destinationAddress, setDestinationAddress] = useState<
    NullableAddress | undefined
  >();
  const [searchKeyword2, setSearchKeyword2] = useState("");

  const {
    data: productMeasureUnitData,
    isLoading: isLoadingProductMeasureUnit,
  } = useQuery<ProductMeasureUnit[]>({
    queryKey: ["productMeasureUnitsSelect", query],
    queryFn: () =>
      GET(`/productMeasureUnits`, {
        ...(query.length > 0 && {
          search: query,
        }),
      }),
  });

  const addOrderMutation = useMutation({
    mutationFn: (payload: any) => POST(`/orders`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      Toast.fire({
        icon: "success",
        title: `La commande a eté ajouté avec succès`,
      });
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const itemsValidation = useMemo(() => {
    return (
      items.length > 0 &&
      items.every(
        (item) =>
          (item.productMeasureUnit?._id ?? "").length > 0 &&
          (item?.totalAmount ?? 0) > 0 &&
          (item.quantity ?? 0) > 0,
      )
    );
  }, [items]);
  const fieldsValidation = useMemo(() => {
    return (
      startDate === undefined ||
      endDate === undefined ||
      status === undefined ||
      client === null ||
      !itemsValidation ||
      (destinationAddress?.name ?? "").trim().length === 0 ||
      (destinationAddress?.location?.lng ?? 0) === 0 ||
      (destinationAddress?.location?.lat ?? 0) === 0
    );
  }, [
    client,
    destinationAddress?.location?.lat,
    destinationAddress?.location?.lng,
    destinationAddress?.name,
    endDate,
    itemsValidation,
    startDate,
    status,
  ]);

  const addNewItem = useCallback(() => {
    const itemsIds = items.map((item) => item.productMeasureUnit?.product._id);
    const filteredItemsIds = itemsIds.filter(
      (id): id is string => id !== undefined,
    );

    let productMeasureUnitNewData = productMeasureUnitData?.filter(
      (productMeasure) =>
        !filteredItemsIds.includes(productMeasure.product._id),
    );

    if (
      productMeasureUnitNewData?.length === 0 ||
      itemsIds.includes(undefined)
    ) {
      return null;
    }

    // Create a new array instead of mutating the existing one
    setItems((prevState) => [
      ...prevState,
      {
        id: prevState.length + 1,
        productMeasureUnit: undefined,
        quantity: undefined,
        totalAmount: undefined,
        extra: undefined,
      },
    ]);
  }, [items, productMeasureUnitData]);

  const itemIsDisabled = (value: ProductMeasureUnit) => {
    const itemsIds = items.map((item) => item.productMeasureUnit?.product._id);
    const filteredItemsIds = itemsIds.filter(
      (id): id is string => id !== undefined,
    );

    return filteredItemsIds.includes(value.product._id);
  };

  const addOrder = async () => {
    let newOrder = {
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(status !== undefined && { status: status.name }),
      ...(description.trim().length > 0 && { description }),
      ...(client !== null && { client: client._id }),
      ...(destinationAddress?.name &&
        destinationAddress?.location?.lat &&
        destinationAddress?.location?.lng && {
          arrivalAddress: {
            name: destinationAddress.name,
            location: {
              lat: destinationAddress.location.lat,
              lng: destinationAddress.location.lng,
            },
          },
        }),
      ...(items.length > 0 &&
        items.every(
          (item) =>
            (item.productMeasureUnit?._id ?? "").length > 0 &&
            (item?.totalAmount ?? 0) > 0 &&
            (item.quantity ?? 0) > 0,
        ) && {
          items: items.map((item) => {
            return {
              productMeasureUnit: item.productMeasureUnit?._id,
              quantity: item.quantity,
              ...((item.extra?.type ?? "") !== "" &&
                (item.extra?.value ?? 0) > 0 && {
                  extra: {
                    type: item.extra?.type,
                    value: item.extra?.value,
                  },
                }),
            };
          }),
        }),
    };

    if (fieldsValidation) {
      Toast.fire({
        icon: "error",
        title: `Merci de remplir tous les champs requis`,
      });
      return;
    }

    if (action === "create") {
      console.log(newOrder);
      addOrderMutation.mutate(newOrder);
    } else {
      /*      if (!wasChanged) {
        Toast.fire({
          icon: "error",
          title: `Veuillez modifier les champs`,
        });
        return;
      }
      editClientMutation.mutate(newClient);*/
    }
  };

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-start items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="px-4 py-2 bg-slate-400 rounded-sm"
        >
          <i className="fa-solid fa-arrow-left text-white"></i>
        </button>
        <p className="ml-2 font-semibold text-2xl">Créer un commande</p>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row pt-5 gap-5 justify-between">
          <div className="w-[60%] p-7 bg-[#FAFBFF] rounded-[12px]">
            <div className="mb-5 flex flex-row justify-between items-center">
              <div className="flex flex-col w-full gap-3">
                <p className="mb-3 font-semibold text-2xl">Commande</p>
                <div className="flex flex-row z-20 w-full gap-5">
                  <Popover className=" w-full">
                    <div className="flex flex-col gap-1">
                      <label>Date de début</label>

                      <PopoverButton className="w-full justify-start text-left flex flex-row items-center gap-2 text-base font-semibold text-black bg-white border p-1.5 rounded-md">
                        <CalendarIcon className="w-4 h-4" />
                        {startDate ? (
                          format(startDate, "dd/MM/yyyy", {
                            locale: fr,
                          })
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                      </PopoverButton>
                    </div>
                    <PopoverPanel
                      transition
                      anchor="bottom"
                      className="  text-black z-50  divide-y p-3 border border-gray-100 shadow-md rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                    >
                      <Calendar
                        locale={fr}
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverPanel>
                  </Popover>
                  <Popover className=" w-full">
                    <div className="flex flex-col gap-1">
                      <label>Date de fin</label>

                      <PopoverButton className="w-full justify-start text-left flex flex-row items-center gap-2 text-base font-semibold text-black bg-white border p-1.5 rounded-md">
                        <CalendarIcon className="w-4 h-4" />
                        {endDate ? (
                          format(endDate, "dd/MM/yyyy", {
                            locale: fr,
                          })
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                      </PopoverButton>
                    </div>
                    <PopoverPanel
                      transition
                      anchor="bottom"
                      className="  text-black z-50  divide-y p-3 border border-gray-100 shadow-md rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                    >
                      <Calendar
                        locale={fr}
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverPanel>
                  </Popover>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Status de le commande</label>
                  <Listbox
                    value={status ?? ""}
                    onChange={(value) => {
                      if (typeof value === "string") return;
                      else setStatus(value);
                    }}
                  >
                    <ListboxButton className="w-full justify-start text-left flex flex-row items-center gap-2 text-base font-semibold text-black bg-white border p-1.5 rounded-md">
                      {status?.name
                        ? orderStatusToFrench(status.name)
                        : "Veuillez sélectionner un status"}
                    </ListboxButton>
                    <ListboxOptions
                      anchor="bottom"
                      className="w-[var(--button-width)] text-black z-50   p-3 border border-gray-100 shadow-md rounded-xl bg-white text-base transition duration-200 ease-in-out"
                    >
                      {orderStatusArray.map((statusOr) => (
                        <ListboxOption
                          key={statusOr.name}
                          value={statusOr}
                          className="data-[focus]:bg-gray-100 p-1 rounded-md"
                          disabled={statusOr.disabled}
                        >
                          {orderStatusToFrench(statusOr?.name)}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Description</label>
                  <Textarea
                    name="description"
                    className="w-full justify-start text-left flex flex-row items-center gap-2 text-base font-semibold text-black bg-white border p-1.5 rounded-md"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client info */}
          <div className="flex flex-col w-[40%] gap-5 p-7 bg-[#FAFBFF] rounded-[12px]">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row justify-between">
                <p className="mb-3 font-semibold text-2xl">Client </p>
              </div>
            </div>
            <div className="w-full">
              <ClientSelect
                showLabel={false}
                selectedClient={client}
                setSelectedClient={(value) => {
                  setClient(value);
                  setPhone(value?.phone ?? "");
                  setEmail(value?.email ?? "");
                }}
                formatSelectedDisplay={(value) => {
                  return `${value.firstName} ${value.lastName}`;
                }}
              />
            </div>
            <div className="flex flex-col w-full justify-start items-start gap-2 relative ">
              <label className="text-base [font-family:'Inter-Regular',Helvetica]">
                Numéro de téléphone
              </label>
              <input
                readOnly
                maxLength={300}
                id={"client-phone-order"}
                value={phone}
                className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={"Veuillez entrer un phone"}
              />
            </div>
            <div className="flex flex-col w-full justify-start items-start gap-2 relative ">
              <label className="text-base [font-family:'Inter-Regular',Helvetica]">
                Email
              </label>
              <input
                readOnly
                maxLength={300}
                id={"client-email-order"}
                value={email}
                className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={"Veuillez entrer un email"}
              />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="w-full p-7 bg-[#FAFBFF] rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="mb-3 flex flex-row gap-5 items-center ">
              <p className=" font-semibold text-2xl">Produits</p>
              <Button
                onClick={() => {
                  addNewItem();
                }}
                disabled={isLoadingProductMeasureUnit}
                className="flex flex-row gap-2 items-center rounded bg-sky-700 py-1 px-4 text-sm text-white data-[hover]:bg-sky-600 data-[active]:bg-sky-700"
              >
                Ajouter
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-auto max-h-80">
              {isLoadingProductMeasureUnit ? (
                <CustomLoader className="min-h-56" />
              ) : (
                <div className="flex flex-col  divide-y-2 ">
                  {items.length === 0 ? (
                    <div className="text-2xl font-semibold flex justify-center items-center h-56">
                      Pas de produits
                    </div>
                  ) : (
                    items.map((item) => (
                      <OrderItemComponent
                        key={`order-item-${item.id}`}
                        search={query}
                        setSearch={setQuery}
                        data={productMeasureUnitData}
                        isDataLoading={isLoadingProductMeasureUnit}
                        itemIsDisabled={itemIsDisabled}
                        item={item}
                        setItem={(value) => {
                          setItems((prevState) =>
                            prevState.map((prevItem) =>
                              prevItem.id === value.id
                                ? { ...prevItem, ...value }
                                : prevItem,
                            ),
                          );
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Adresse du destinataire */}
        <div className="flex flex-col w-full gap-5 px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="mb-5 flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">
                Adresse du destinataire
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center">
            {renderInputField(
              ADD_ORDER_INPUTS[18],
              searchKeyword2,
              (e) => setSearchKeyword2(e.target.value),
              undefined,
              undefined,
              "w-full",
            )}
            {renderInputField(
              ADD_ORDER_INPUTS[17],
              destinationAddress?.name ?? "",
              (e) => {
                setDestinationAddress((prevState) => {
                  return {
                    name: e.target.value ?? "",
                    location: {
                      lng: prevState?.location?.lng ?? 0,
                      lat: prevState?.location?.lat ?? 0,
                    },
                  };
                });
              },
              undefined,
              undefined,
              "w-full",
            )}

            <div className="p-2 w-full h-full">
              <MapWrapper
                coordinates={destinationAddress?.location}
                setCoordinates={(coordinates) => {
                  setDestinationAddress((prevState) => {
                    return {
                      name: prevState?.name ?? "",
                      location: {
                        lat: coordinates.lat ?? 0,
                        lng: coordinates.lng ?? 0,
                      },
                    };
                  });
                }}
              />
            </div>

            <div className="flex flex-row w-full  items-start gap-5 ">
              {renderInputField(
                ADD_ORDER_INPUTS[19],
                destinationAddress?.location?.lng?.toString() ?? "",
                (e) => {
                  const lng = isNaN(Number(e.target.value))
                    ? 0
                    : Number(e.target.value);

                  setDestinationAddress((prevState) => {
                    return {
                      name: prevState?.name ?? "",
                      location: {
                        lat: prevState?.location?.lat ?? 0,
                        lng: lng,
                      },
                    };
                  });
                },
                undefined,
                undefined,
                "w-[50%]",
              )}
              {renderInputField(
                ADD_ORDER_INPUTS[20],
                destinationAddress?.location?.lat?.toString() ?? "",
                (e) => {
                  const lat = isNaN(Number(e.target.value))
                    ? 0
                    : Number(e.target.value);

                  setDestinationAddress((prevState) => {
                    return {
                      name: prevState?.name ?? "",
                      location: {
                        lng: prevState?.location?.lng ?? 0,
                        lat: lat,
                      },
                    };
                  });
                },
                undefined,
                undefined,
                "w-[50%]",
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Form */}
      <center>
        <button
          onClick={() => {
            addOrder();
          }}
          className="my-5 px-10 py-2 bg-[#3D75B0] text-white rounded-md"
        >
          {addOrderMutation.isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            `Enregistrer`
          )}
        </button>
      </center>
    </div>
  );
};

export default OrderForm;
