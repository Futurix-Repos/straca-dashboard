import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import React, { useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CircleEllipsis,
  Loader,
} from "lucide-react";
import clsx from "clsx";
import { MeasureUnit, Product, ProductType } from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/constants/fetchConfig";

export const MeasureUnitSelect = ({
  show,
  multiple = false,
  selectedMeasureUnit,
  setSelectedMeasureUnit,
  disabled,
  itemIsDisabled,
}: {
  show?: boolean;
  multiple?: boolean;
  selectedMeasureUnit: MeasureUnit | MeasureUnit[] | null;
  setSelectedMeasureUnit: (value: MeasureUnit | MeasureUnit[] | null) => void;
  disabled?: boolean;
  itemIsDisabled?: (measure: MeasureUnit) => boolean;
}) => {
  const [query, setQuery] = useState("");

  const { data: measureUnitsData, isLoading: isLoadingMeasureUnits } = useQuery<
    MeasureUnit[]
  >({
    queryKey: ["measureUnitsSelect", query],
    queryFn: () =>
      GET(`/measureUnits`, {
        ...(query.length > 0 && {
          search: query,
        }),
      }),
  });

  if (show !== undefined && !show) return null;

  return (
    <Combobox
      multiple={multiple}
      // @ts-ignore
      value={selectedMeasureUnit}
      onChange={(value: any) => {
        setSelectedMeasureUnit(value);
      }}
      onClose={() => setQuery("")}
      disabled={disabled}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="w-fit  [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
          Unités de mesure
        </div>
        <div className="w-full relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg text-gray-900 bg-white border border-gray-200  py-1.5 pr-8 pl-3 text-base ",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
            placeholder={"Veuillez sélectionner une unité"}
            displayValue={(measure: MeasureUnit | MeasureUnit[] | null) => {
              if (!measure) return query;

              if (Array.isArray(measure)) {
                return measure.map((t) => t.label).join(", ");
              }

              return `${measure.label} - ${measure.description}`;
            }}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
          <ComboboxButton
            disabled={isLoadingMeasureUnits}
            className="group absolute inset-y-0 right-0 flex items-center pr-2"
          >
            {isLoadingMeasureUnits ? (
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
        {(measureUnitsData ?? []).map((measureUnit: MeasureUnit) => (
          <ComboboxOption
            key={measureUnit._id}
            value={measureUnit}
            disabled={itemIsDisabled ? itemIsDisabled(measureUnit) : false}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 data-[disabled]:opacity-40"
          >
            <CheckIcon className="invisible size-4 text-black group-data-[selected]:visible" />
            <div className="text-sm/6 text-black">
              {measureUnit.label} - {measureUnit.description}
            </div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
