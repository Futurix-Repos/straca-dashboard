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
import {
  MeasureUnit,
  Product,
  ProductMeasureUnit,
  ProductType,
} from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/constants/fetchConfig";

export const ProductMeasureUnitSelect = ({
  show,
  selectedProductMeasureUnit,
  setSelectedProductMeasureUnit,
  disabled,
  itemIsDisabled,
  data,
  isLoading,
  search,
  setSearch,
}: {
  show?: boolean;
  selectedProductMeasureUnit: ProductMeasureUnit | null;
  setSelectedProductMeasureUnit: (value: ProductMeasureUnit | null) => void;
  disabled?: boolean;
  itemIsDisabled?: (productMeasureUnit: ProductMeasureUnit) => boolean;
  data?: ProductMeasureUnit[];
  isLoading?: boolean;
  search?: string;
  setSearch?: (value: string) => void;
}) => {
  const [query, setQuery] = useState("");

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
    enabled: !(data !== undefined || isLoading !== undefined),
  });

  if (show !== undefined && !show) return null;

  return (
    <Combobox
      value={selectedProductMeasureUnit}
      onChange={(value) => {
        setSelectedProductMeasureUnit(value);
      }}
      onClose={() => setQuery("")}
      disabled={disabled}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="w-fit  [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
          Produit par unité de mesure
        </div>
        <div className="w-full relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg text-gray-900 bg-white border border-gray-200  py-1.5 pr-8 pl-3 text-base ",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
            placeholder={"Veuillez sélectionner un  produit"}
            displayValue={(productMeasureUnit: ProductMeasureUnit | null) =>
              productMeasureUnit
                ? `${productMeasureUnit.product.name} - ${productMeasureUnit.measureUnit.label} - ${productMeasureUnit.amount}`
                : (search ?? query)
            }
            onChange={(event) => {
              setSearch
                ? setSearch(event.target.value)
                : setQuery(event.target.value);
            }}
          />
          <ComboboxButton
            disabled={
              isLoading != undefined ? isLoading : isLoadingProductMeasureUnit
            }
            className="group absolute inset-y-0 right-0 flex items-center pr-2"
          >
            {(
              isLoading != undefined ? isLoading : isLoadingProductMeasureUnit
            ) ? (
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
        {(data ?? productMeasureUnitData ?? []).map(
          (productMeasureUnit: ProductMeasureUnit) => (
            <ComboboxOption
              key={productMeasureUnit._id}
              value={productMeasureUnit}
              disabled={
                itemIsDisabled ? itemIsDisabled(productMeasureUnit) : false
              }
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 data-[disabled]:opacity-40"
            >
              <CheckIcon className="invisible size-4 text-black group-data-[selected]:visible" />
              <div className="text-sm/6 text-black">{`${productMeasureUnit.product.name} - ${productMeasureUnit.measureUnit.label} - ${productMeasureUnit.amount}`}</div>
            </ComboboxOption>
          ),
        )}
      </ComboboxOptions>
    </Combobox>
  );
};
