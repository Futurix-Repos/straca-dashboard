import { DeliveryStatus, Extra, OrderStatus } from "@/constants/types";
import { orderStatusToFrench } from "@/constants/helpers";
import React from "react";
import DeliveryStatusBadge from "@/pages/dashboard/components/DeliveryStatusBadge";

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.INITIATED:
      return (
        <div className="bg-gray-500/30 text-gray-500 border border-gray-500 rounded-md text-base py-1 px-3 min-w-32">
          {orderStatusToFrench(status)}
        </div>
      );
    case OrderStatus.IN_PROGRESS:
      return (
        <div className="bg-orange-500/30 text-orange-500 border border-orange-500 rounded-md text-base py-1 px-3 min-w-32">
          {orderStatusToFrench(status)}
        </div>
      );
    case OrderStatus.FINISHED:
      return (
        <div className="bg-green-500/30 text-green-500 border border-green-500 rounded-md text-base py-1 px-3 min-w-32">
          {orderStatusToFrench(status)}
        </div>
      );
    case OrderStatus.CANCELED:
      return (
        <div className="bg-red-500/30 text-red-500 border border-red-500 rounded-md text-base py-1 px-3 min-w-32">
          {orderStatusToFrench(status)}
        </div>
      );
  }
};

export default OrderStatusBadge;
