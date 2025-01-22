import { deliveryStatusToFrench } from "@/constants/helpers";
import { DeliveryStatus } from "@/constants/types";
import React from "react";

const DeliveryStatusBadge = ({ status }: { status: DeliveryStatus }) => {
  switch (status) {
    case DeliveryStatus.IN_PROGRESS:
      return (
        <div className="bg-orange-blue/30 text-blue-500 border border-blue-500 rounded-md text-base py-1 px-3 min-w-32">
          {deliveryStatusToFrench(status)}
        </div>
      );
    case DeliveryStatus.PENDING:
      return (
        <div className="bg-orange-500/30 text-orange-500 border border-orange-500 rounded-md text-base py-1 px-3 min-w-32">
          {deliveryStatusToFrench(status)}
        </div>
      );
    case DeliveryStatus.DELIVERED:
      return (
        <div className="bg-green-500/30 text-green-500 border border-green-500 rounded-md text-base py-1 px-3 min-w-32">
          {deliveryStatusToFrench(status)}
        </div>
      );
    case DeliveryStatus.CANCELED:
      return (
        <div className="bg-red-500/30 text-red-500 border border-red-500 rounded-md text-base py-1 px-3 min-w-32">
          {deliveryStatusToFrench(status)}
        </div>
      );
  }
};

export default DeliveryStatusBadge;
