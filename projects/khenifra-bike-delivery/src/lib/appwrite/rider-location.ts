import { ID, Permission, Query, Role } from "appwrite";
import { account, tablesDB } from "@/lib/appwrite/client";

const databaseId =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "khenifra_delivery";
const locationsTableId = "rider_locations";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";

async function currentUser() {
  return account.get();
}

export async function getMyRiderState() {
  const user = await currentUser();
  const [riders, deliveries] = await Promise.all([
    tablesDB.listRows({
      databaseId,
      tableId: ridersTableId,
      queries: [Query.equal("user_id", [user.$id]), Query.limit(1)],
    }),
    tablesDB.listRows({
      databaseId,
      tableId: deliveriesTableId,
      queries: [Query.equal("rider_id", [user.$id]), Query.limit(25)],
    }),
  ]);

  let location = null;
  try {
    const locations = await tablesDB.listRows({
      databaseId,
      tableId: locationsTableId,
      queries: [Query.equal("user_id", [user.$id]), Query.limit(1)],
    });
    location = locations.rows[0] || null;
  } catch {
    location = null;
  }

  return {
    user,
    rider: riders.rows[0] || null,
    location,
    deliveries: deliveries.rows,
  };
}

export async function setRiderAvailability({
  lat,
  lng,
  isAvailable,
}: {
  lat: number;
  lng: number;
  isAvailable: boolean;
}) {
  const user = await currentUser();
  const permissions = [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
  ];

  const existing = await tablesDB.listRows({
    databaseId,
    tableId: locationsTableId,
    queries: [Query.equal("user_id", [user.$id]), Query.limit(1)],
  });

  const data = {
    user_id: user.$id,
    lat,
    lng,
    is_available: isAvailable,
    updated_at: new Date().toISOString(),
  };

  if (existing.rows[0]) {
    return tablesDB.updateRow({
      databaseId,
      tableId: locationsTableId,
      rowId: existing.rows[0].$id,
      data,
    });
  }

  return tablesDB.createRow({
    databaseId,
    tableId: locationsTableId,
    rowId: ID.unique(),
    data,
    permissions,
  });
}


export async function updateAssignedDelivery(
  deliveryId: string,
  action: "advance" | "deliver",
  pin?: string
) {
  const jwt = await account.createJWT();
  const response = await fetch("/api/rider/deliveries", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-appwrite-jwt": jwt.jwt,
    },
    body: JSON.stringify({ deliveryId, action, pin }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || json.detail || "Could not update delivery");
  }
  return json;
}
