import { PermissionName } from "@/components/dashboard_components/users-permissions/UsersPermissionsList";
import { User } from "next-auth";

const SettingElemTypeObj = {
  products: "products",
  productTypes: "productTypes",
  blogTypes: "blogTypes",
  vehicleTypes: "vehicleTypes",
  vehicleSources: "vehicleSources",
  vehicleBrands: "vehicleBrands",
  vehicleModels: "vehicleModels",
  locations: "locations",
  contractTypes: "contractTypes",
  proximity: "proximity",
  measureUnits: "measureUnits",
} as const;

export type SettingElemType =
  (typeof SettingElemTypeObj)[keyof typeof SettingElemTypeObj];

export const settingElemTypes = Object.values(SettingElemTypeObj);

export interface Proximity {
  _id: string;
  label: string;
  description: string;
}

export interface ContractType {
  _id: string;
  label: string;
  description: string;
}

export interface VehicleType {
  _id: string;
  label: string;
  description: string;
}

export interface BlogType {
  _id: string;
  label: string;
  description: string;
  slug: string;
}

export interface ProductType {
  _id: string;
  label: string;
  description: string;
}

export interface Pricing {
  _id: string;
  amount: number;
  product?: Product;
  measureUnit?: MeasureUnit;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  productType: ProductType;
  measureUnits: ProductMeasureUnit[];
}

export interface MeasureUnit {
  _id: string;
  label: string;
  description: string;
  products: ProductMeasureUnit[];
}

export interface ProductMeasureUnit {
  _id: string;
  amount: number;
  product: Product;
  measureUnit: MeasureUnit;
  isDefault: boolean;
}

export interface VehicleSource {
  _id: string;
  label: string;
  description: string;
}

export interface VehicleBrand {
  _id: string;
  label: string;
  description: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  _id: string;
  label: string;
  description: string;
  brand: VehicleBrand;
}

export interface Location {
  _id: string;
  label: string;
  description: string;
}

export interface Permission {
  _id: string;
  name: PermissionName;
  description: string;
  action: "update" | "read" | "create" | "delete";
}
export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  address: string;
  title?: string;
  company?: string;
  type: "admin" | "employee" | "client";
  permissions: Permission[];
  confirmed: boolean;
}

export interface Vehicle {
  _id: string;
  name: string;
  registrationNumber: string;
  trackingId: string;
  type: VehicleType;
  model: VehicleModel;
  source: VehicleSource;
  driver: UserType;
  createdBy: UserType;
  createdAt: string;
}

export enum DeliveryStatus {
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}
export type DeliverySenderReceiver = {
  user: UserType; // References "User"
  quantity: number;
  note?: string;
  validateBy?: UserType;
  validate?: Boolean; // Optional field
};

export type Delivery = {
  _id: string;
  reference: string;
  order: Order;
  departureAddress: Location; // References "Location"
  vehicle: Vehicle; // References "Vehicle"
  productMeasureUnit: ProductMeasureUnit; // References "Product"
  sender: DeliverySenderReceiver;
  receiver?: DeliverySenderReceiver;
  status: DeliveryStatus;
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
};

export enum OrderStatus {
  INITIATED = "INITIATED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
}

export type Extra = {
  type?: "RISE" | "DISCOUNT" | "";
  value?: number;
};

export type Address = {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type NullableAddress = {
  [K in keyof Address]: Address[K] | undefined;
};

export type OrderItem = {
  productMeasureUnit: ProductMeasureUnit; // References "ProductMeasureUnit"
  quantity: number;
  totalAmount: number;
  extra?: Extra; // Optional field
};

export type NullableOrderItem = {
  [K in keyof OrderItem]: OrderItem[K] | undefined;
};

export type NullableOrderItemWithId = NullableOrderItem & {
  id: number;
};

export type Order = {
  _id: string;
  reference: string;
  startDate: Date;
  endDate: Date;
  status: OrderStatus;
  description?: string;
  client: UserType;
  arrivalAddress: Address;
  items: OrderItem[];
  totalAmount: number;
  createdBy: UserType;
  updatedBy?: UserType;
  createdAt: Date;
  updatedAt: Date;
  deliveries: Delivery[];
};
