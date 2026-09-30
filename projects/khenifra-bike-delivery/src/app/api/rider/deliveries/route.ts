import { ID, Permission, Role } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB } from "@/lib/appwrite/admin-server";
import { getUserFromJWT } from "@/lib/appwrite/auth-server";
import { deliveryPin } from "@/lib/delivery-pin";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const eventsTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERY_EVENTS_TABLE_ID || "delivery_events";

const nextStatus: Record<string, string> = {
  assigned: "rider_to_pickup",
  rider_to_pickup: "picked_up",
  picked_up: "rider_to_dropoff",
};

function participantPermissions(customerId: string, riderId: string) {
  return [
    Permission.read(Role.user(customerId)),
    Permission.read(Role.user(riderId)),
  ];
}

async function createEvent(
  delivery: any,
  riderId: string,
  status: string,
  note: string
) {
  await adminTablesDB.createRow({
    databaseId: adminDatabaseId,
    tableId: eventsTableId,
    rowId: ID.unique(),
    data: {
      delivery_id: delivery.$id,
      status,
      note,
      actor_id: riderId,
      created_at: new Date().toISOString(),
    },
    permissions: participantPermissions(delivery.customer_id, riderId),
  });
}

async function authenticate(request: NextRequest) {
  const jwt = request.headers.get("x-appwrite-jwt");
  if (!jwt) return null;
  try {
    return await getUserFromJWT(jwt);
  } catch {
    return null;
  }
}

export async function PATCH(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const deliveryId = String(body.deliveryId || "");
    const action = String(body.action || "");

    if (!deliveryId) {
      return NextResponse.json({ error: "Missing deliveryId" }, { status: 400 });
    }

    const [delivery, riders] = await Promise.all([
      adminTablesDB.getRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
      }),
      adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: ridersTableId,
      }),
    ]);

    const rider = riders.rows.find(
      (row: any) => row.user_id === user.$id && row.status === "approved"
    );

    if (!rider || (delivery as any).rider_id !== user.$id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const current = String((delivery as any).status);

    if (action === "advance") {
      const status = nextStatus[current];
      if (!status) {
        return NextResponse.json(
          { error: "Status cannot be advanced from current state" },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const data: Record<string, unknown> = { status };
      if (status === "picked_up") data.picked_up_at = now;

      const updated: any = await adminTablesDB.updateRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
        data,
        permissions: participantPermissions(
          (delivery as any).customer_id,
          user.$id
        ),
      });

      await createEvent(
        delivery,
        user.$id,
        status,
        status === "rider_to_pickup"
          ? "Rider accepted delivery and is heading to pickup"
          : status === "picked_up"
            ? "Rider confirmed pickup"
            : "Rider is heading to customer"
      );

      return NextResponse.json({
        delivery: {
          id: updated.$id,
          status: updated.status,
        },
      });
    }

    if (action === "deliver") {
      if (current !== "rider_to_dropoff") {
        return NextResponse.json(
          { error: "Delivery is not ready for completion" },
          { status: 400 }
        );
      }

      const suppliedPin = String(body.pin || "").trim();
      if (!/^\d{4}$/.test(suppliedPin)) {
        return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
      }

      if (suppliedPin !== deliveryPin(deliveryId)) {
        return NextResponse.json({ error: "Incorrect PIN" }, { status: 400 });
      }

      const now = new Date().toISOString();
      const updated: any = await adminTablesDB.updateRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
        data: {
          status: "delivered",
          delivered_at: now,
        },
        permissions: participantPermissions(
          (delivery as any).customer_id,
          user.$id
        ),
      });

      await createEvent(
        delivery,
        user.$id,
        "delivered",
        "Delivery completed after PIN verification"
      );

      return NextResponse.json({
        delivery: {
          id: updated.$id,
          status: updated.status,
          deliveredAt: updated.delivered_at,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Rider delivery PATCH failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update delivery",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
