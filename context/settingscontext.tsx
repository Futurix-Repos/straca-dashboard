import { BlogType } from "@/components/dashboard_components/SettingComponents/blogcard";
import { ContractType } from "@/components/dashboard_components/SettingComponents/contractTypeCard";
import { CountryType } from "@/components/dashboard_components/SettingComponents/countrycard";
import { ProductType } from "@/components/dashboard_components/SettingComponents/productcard";
import { Proximity } from "@/components/dashboard_components/SettingComponents/proximityCard";
import { VehicleType } from "@/components/dashboard_components/SettingComponents/vehiclecard";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SettingsContextProps {
  selectedProductType: ProductType | null;
  setSelectedProductType: (item: ProductType | null) => void;
  selectedBlogType: BlogType | null;
  setSelectedBlogType: (item: BlogType | null) => void;
  selectedVehicleType: VehicleType | null;
  setSelectedVehicleType: (item: VehicleType | null) => void;
  selectedCountryType: CountryType | null;
  setSelectedCountryType: (item: CountryType | null) => void;
  selectedContractType: CountryType | null;
  setSelectedContractType: (item: CountryType | null) => void;
  selectedProximity: CountryType | null;
  setSelectedProximity: (item: CountryType | null) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);
  const [selectedBlogType, setSelectedBlogType] = useState<BlogType | null>(
    null
  );
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null);
  const [selectedCountryType, setSelectedCountryType] =
    useState<CountryType | null>(null);
  const [selectedContractType, setSelectedContractType] =
    useState<ContractType | null>(null);
  const [selectedProximity, setSelectedProximity] =
    useState<Proximity | null>(null);
  return (
    <SettingsContext.Provider
      value={{
        selectedProductType,
        setSelectedProductType,
        selectedBlogType,
        setSelectedBlogType,
        selectedVehicleType,
        setSelectedVehicleType,
        selectedCountryType,
        setSelectedCountryType,
        selectedContractType,
        setSelectedContractType,
        selectedProximity,
        setSelectedProximity,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
