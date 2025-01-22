import {
  BlogType,
  ProductType,
  VehicleType,
  ContractType,
  Proximity,
  VehicleSource,
  VehicleBrand,
  VehicleModel,
  Location,
} from "@/constants/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SettingsContextProps {
  selectedProductType: ProductType | null;
  setSelectedProductType: (item: ProductType | null) => void;
  selectedBlogType: BlogType | null;
  setSelectedBlogType: (item: BlogType | null) => void;
  selectedVehicleType: VehicleType | null;
  setSelectedVehicleType: (item: VehicleType | null) => void;
  selectedVehicleSource: VehicleSource | null;
  setSelectedVehicleSource: (item: VehicleSource | null) => void;
  selectedVehicleBrand: VehicleBrand | null;
  setSelectedVehicleBrand: (item: VehicleBrand | null) => void;
  selectedVehicleModel: VehicleModel | null;
  setSelectedVehicleModel: (item: VehicleModel | null) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (item: Location | null) => void;
  selectedContractType: ContractType | null;
  setSelectedContractType: (item: ContractType | null) => void;
  selectedProximity: Proximity | null;
  setSelectedProximity: (item: Proximity | null) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);
  const [selectedBlogType, setSelectedBlogType] = useState<BlogType | null>(
    null,
  );
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null);
  const [selectedVehicleSource, setSelectedVehicleSource] =
    useState<VehicleSource | null>(null);
  const [selectedVehicleBrand, setSelectedVehicleBrand] =
    useState<VehicleBrand | null>(null);
  const [selectedVehicleModel, setSelectedVehicleModel] =
    useState<VehicleModel | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [selectedContractType, setSelectedContractType] =
    useState<ContractType | null>(null);
  const [selectedProximity, setSelectedProximity] = useState<Proximity | null>(
    null,
  );
  return (
    <SettingsContext.Provider
      value={{
        selectedProductType,
        setSelectedProductType,
        selectedBlogType,
        setSelectedBlogType,
        selectedVehicleType,
        setSelectedVehicleType,
        selectedVehicleSource,
        setSelectedVehicleSource,
        selectedVehicleBrand,
        setSelectedVehicleBrand,
        selectedVehicleModel,
        setSelectedVehicleModel,
        selectedLocation,
        setSelectedLocation,
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
