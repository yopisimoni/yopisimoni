import { ID, Permission, Role } from "appwrite";
import { account, tablesDB } from "@/lib/appwrite/client";
import type { CreateDeliveryInput, DeliveryRecord } from "@/lib/backend/deliveries";

const databaseId =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "khenifra_delivery";
const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";

async function getOrCreateCustomer() {
  try {
    return await account.get();
  } catch {
    await account.createAnonymousSession();
    return account.get();
  }
}

function makeOrderCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return "KHF-" + Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 6)
    .toUpperCase();
}

export async function createDelivery(
  input: CreateDeliveryInput
): Promise<DeliveryRecord> {
  const customer = await getOrCreateCustomer();
  const requestedAt = new Date().toISOString();
  const orderCode = makeOrderCode();

  const row = await tablesDB.createRow({
    databaseId,
    tableId: deliveriesTableId,
    rowId: ID.unique(),
    data: {
      order_code: orderCode,
      customer_id: customer.$id,
      rider_id: null,
      business_id: null,
      category: input.category,
      status: "requested",
      pickup_address: input.pickupAddress,
      dropoff_address: input.dropoffAddress,
      sender_phone: input.senderPhone,
      recipient_phone: input.recipientPhone,
      notes: input.notes || null,
      quoted_price_mad: null,
      final_price_mad: null,
      delivery_pin: null,
      requested_at: requestedAt,
      assigned_at: null,
      picked_up_at: null,
      delivered_at: null,
      ...(typeof input.pickupLat === "number" ? { pickup_lat: input.pickupLat } : {}),
      ...(typeof input.pickupLng === "number" ? { pickup_lng: input.pickupLng } : {}),
    },
    permissions: [
      Permission.read(Role.user(customer.$id)),
    ],
  });

  let deliveryPinValue: string | undefined;
  try {
    const jwt = await account.createJWT();
    const response = await fetch("/api/customer/delivery-pin", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-appwrite-jwt": jwt.jwt,
      },
      body: JSON.stringify({ deliveryId: row.$id }),
    });
    if (response.ok) {
      const json = await response.json();
      deliveryPinValue = json.pin;
    }
  } catch (error) {
    console.error("Could not generate delivery PIN", error);
  }

  return {
    id: row.$id,
    orderCode,
    status: "requested",
    customerId: customer.$id,
    requestedAt,
    deliveryPin: deliveryPinValue,
    ...input,
  };
}
