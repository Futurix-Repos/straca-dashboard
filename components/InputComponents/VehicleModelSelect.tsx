import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import React, { useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CircleEllipsis,
  Loader,
} from "lucide-react";
import clsx from "clsx";
import { SettingElemType, VehicleBrand, VehicleModel } from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/constants/fetchConfig";

export const VehicleModelSelect = ({
  show,
  selectedModel,
  setSelectedModel,
}: {
  show?: boolean;
  selectedModel: VehicleModel | null;
  setSelectedModel: (value: VehicleModel | null) => void;
}) => {
  const [query, setQuery] = useState("");

  const { data: vehicleModelData, isLoading: isLoadingVehicleModel } = useQuery<
    VehicleModel[]
  >({
    queryKey: ["vehicleModelsSelect", query],
    queryFn: () =>
      GET(`/vehicleModels`, {
        ...(query.length > 0 && {
          search: query,
        }),
      }),
  });

  if (show !== undefined && !show) return null;

  return (
    <Combobox
      value={selectedModel}
      onChange={(value) => {
        setSelectedModel(value);
      }}
      onClose={() => setQuery("")}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="w-fit  [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
          Modèle de véhicule
        </div>
        <div className="w-full relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg text-gray-900 bg-white border border-gray-200  py-1.5 pr-8 pl-3  ",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
            placeholder={"Veuillez sélectionner un modèle"}
            displayValue={(model: VehicleModel | null) =>
              model ? `${model?.label} -  ${model?.brand.label}` : query
            }
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
          <ComboboxButton
            disabled={isLoadingVehicleModel}
            className="group absolute inset-y-0 right-0 flex items-center pr-2"
          >
            {isLoadingVehicleModel ? (
              <Loader className="size-4 animate-spin cursor-none" />
            ) : (
              <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
            )}
          </ComboboxButton>
        </div>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          "w-[var(--input-width)] rounded-xl  mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
        )}
      >
        {(vehicleModelData ?? []).map((model: VehicleModel) => (
          <ComboboxOption
            key={model._id}
            value={model}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
          >
            <CheckIcon className="invisible size-4 text-black group-data-[selected]:visible" />
            <div className="text-sm/6 text-black">{`${model.label} - ${model.brand.label}`}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
