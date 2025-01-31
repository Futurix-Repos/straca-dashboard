import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DeliveryStatus, Extra, OrderStatus } from "@/constants/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function elemTypeToDisplay(type: string) {
  switch (type) {
    case "products":
      return "Produit";
    case "productType":
      return "Type de produit";
    case "blogType":
      return "Type de blog";
    case "vehicleTypes":
      return "Type de véhicule";
    case "vehicleSources":
      return "Source de véhicule";
    case "vehicleBrands":
      return "Marque de véhicule";
    case "vehicleModels":
      return "Modèle de véhicule";
    case "location":
      return "Site";
    case "contractType":
      return "Type de contrat";
    case "proximity":
      return "Proximité";
    case "measureUnits":
      return "Unité de mesure";
    default:
      return type;
  }
}

export const orderStatusToFrench = (status: OrderStatus): string => {
  const translations = {
    [OrderStatus.INITIATED]: "Initiée",
    [OrderStatus.IN_PROGRESS]: "En Transit",
    [OrderStatus.FINISHED]: "Terminée",
    [OrderStatus.CANCELED]: "Annulée",
  };
  return translations[status];
};

export const extraTypeToFrench = (type: Extra["type"]): string => {
  const translations = {
    RISE: "AUGMENTATION",
    DISCOUNT: "RÉDUCTION",
  };
  return type ? translations[type] : "";
};

export const deliveryStatusToFrench = (status: DeliveryStatus): string => {
  const translations: Record<DeliveryStatus, string> = {
    IN_PROGRESS: "En Transit",
    PENDING: "En Attente",
    DELIVERED: "Livrée",
    CANCELED: "Annulée",
  };
  return translations[status];
};
