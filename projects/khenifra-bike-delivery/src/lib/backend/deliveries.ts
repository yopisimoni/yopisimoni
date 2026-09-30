export type DeliveryCategory = "food" | "groceries" | "documents" | "parcel";

export type DeliveryStatus =
  | "requested"
  | "assigned"
  | "rider_to_pickup"
  | "picked_up"
  | "rider_to_dropoff"
  | "delivered"
  | "cancelled"
  | "failed";

export type CreateDeliveryInput = {
  pickupAddress: string;
  dropoffAddress: string;
  category: DeliveryCategory;
  senderPhone: string;
  recipientPhone: string;
  notes?: string;
  pickupLat?: number;
  pickupLng?: number;
};

export type DeliveryRecord = CreateDeliveryInput & {
  id: string;
  orderCode: string;
  status: DeliveryStatus;
  customerId?: string;
  riderId?: string;
  businessId?: string;
  quotedPriceMad?: number;
  finalPriceMad?: number;
  requestedAt: string;
  deliveryPin?: string;
};

export interface DeliveryBackend {
  createDelivery(input: CreateDeliveryInput): Promise<DeliveryRecord>;
  getDelivery(id: string): Promise<DeliveryRecord | null>;
  assignRider(deliveryId: string, riderId: string): Promise<void>;
  updateDeliveryStatus(deliveryId: string, status: DeliveryStatus): Promise<void>;
}
