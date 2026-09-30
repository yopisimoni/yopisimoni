import { ID, Permission, Role } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB } from "@/lib/appwrite/admin-server";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const profilesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";
const eventsTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERY_EVENTS_TABLE_ID || "delivery_events";

const statuses = [
  "requested",
  "assigned",
  "rider_to_pickup",
  "picked_up",
  "rider_to_dropoff",
  "delivered",
  "cancelled",
  "failed",
] as const;

function authorized(request: NextRequest) {
  const configured = process.env.ADMIN_PASSCODE;
  const supplied = request.headers.get("x-admin-passcode");
  return Boolean(configured && supplied && configured === supplied);
}

function participantPermissions(customerId: string, riderId?: string | null) {
  const permissions = [Permission.read(Role.user(customerId))];
  if (riderId) {
    permissions.push(Permission.read(Role.user(riderId)));
  }
  return permissions;
}

async function createEvent({
  deliveryId,
  customerId,
  riderId,
  status,
  note,
}: {
  deliveryId: string;
  customerId: string;
  riderId?: string | null;
  status: (typeof statuses)[number];
  note?: string;
}) {
  const now = new Date().toISOString();

  await adminTablesDB.createRow({
    databaseId: adminDatabaseId,
    tableId: eventsTableId,
    rowId: ID.unique(),
    data: {
      delivery_id: deliveryId,
      status,
      note: note || null,
      actor_id: null,
      created_at: now,
    },
    permissions: participantPermissions(customerId, riderId),
  });
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [deliveries, riders, profiles] = await Promise.all([
      adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
      }),
      adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: ridersTableId,
      }),
      adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: profilesTableId,
      }),
    ]);

    const profileByUser = new Map(
      profiles.rows.map((profile: any) => [profile.user_id, profile])
    );

    const approvedRiders = riders.rows
      .filter((rider: any) => rider.status === "approved")
      .map((rider: any) => {
        const profile: any = profileByUser.get(rider.user_id);
        return {
          id: rider.$id,
          userId: rider.user_id,
          fullName: profile?.full_name || "",
          phone: profile?.phone || "",
          vehicleType: rider.vehicle_type,
          isOnline: rider.is_online,
        };
      });

    const riderByUser = new Map(
      approvedRiders.map((rider: any) => [rider.userId, rider])
    );

    const rows = deliveries.rows.map((delivery: any) => ({
      id: delivery.$id,
      orderCode: delivery.order_code,
      customerId: delivery.customer_id,
      riderId: delivery.rider_id || null,
      riderName: delivery.rider_id
        ? (riderByUser.get(delivery.rider_id) as any)?.fullName || ""
        : "",
      category: delivery.category,
      status: delivery.status,
      pickupAddress: delivery.pickup_address,
      dropoffAddress: delivery.dropoff_address,
      senderPhone: delivery.sender_phone,
      recipientPhone: delivery.recipient_phone,
      notes: delivery.notes || "",
      quotedPriceMad: delivery.quoted_price_mad ?? null,
      finalPriceMad: delivery.final_price_mad ?? null,
      requestedAt: delivery.requested_at,
      assignedAt: delivery.assigned_at || null,
      pickedUpAt: delivery.picked_up_at || null,
      deliveredAt: delivery.delivered_at || null,
    }));

    return NextResponse.json({
      deliveries: rows.reverse(),
      riders: approvedRiders,
    });
  } catch (error: any) {
    console.error("Admin deliveries GET failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load dispatch board",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error), code: error?.code }
          : {}),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const deliveryId = String(body.deliveryId || "");
    const action = String(body.action || "");

    if (!deliveryId) {
      return NextResponse.json({ error: "Missing deliveryId" }, { status: 400 });
    }

    const delivery: any = await adminTablesDB.getRow({
      databaseId: adminDatabaseId,
      tableId: deliveriesTableId,
      rowId: deliveryId,
    });

    if (action === "assign") {
      const riderUserId = String(body.riderUserId || "");
      if (!riderUserId) {
        return NextResponse.json({ error: "Missing rider" }, { status: 400 });
      }

      const riderRows = await adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: ridersTableId,
      });

      const rider: any = riderRows.rows.find(
        (row: any) => row.user_id === riderUserId && row.status === "approved"
      );

      if (!rider) {
        return NextResponse.json(
          { error: "Rider is not approved" },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const updated: any = await adminTablesDB.updateRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
        data: {
          rider_id: riderUserId,
          status: "assigned",
          assigned_at: now,
        },
        permissions: participantPermissions(delivery.customer_id, riderUserId),
      });

      await createEvent({
        deliveryId,
        customerId: delivery.customer_id,
        riderId: riderUserId,
        status: "assigned",
        note: "Rider assigned by admin",
      });

      return NextResponse.json({
        delivery: {
          id: updated.$id,
          riderId: updated.rider_id,
          status: updated.status,
          assignedAt: updated.assigned_at,
        },
      });
    }

    if (action === "status") {
      const status = String(body.status || "") as (typeof statuses)[number];
      if (!statuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const now = new Date().toISOString();
      const data: Record<string, unknown> = { status };

      if (status === "picked_up") data.picked_up_at = now;
      if (status === "delivered") data.delivered_at = now;

      const updated: any = await adminTablesDB.updateRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
        data,
        permissions: participantPermissions(
          delivery.customer_id,
          delivery.rider_id || null
        ),
      });

      await createEvent({
        deliveryId,
        customerId: delivery.customer_id,
        riderId: delivery.rider_id || null,
        status,
        note: "Status updated by admin",
      });

      return NextResponse.json({
        delivery: {
          id: updated.$id,
          status: updated.status,
          pickedUpAt: updated.picked_up_at || null,
          deliveredAt: updated.delivered_at || null,
        },
      });
    }

    if (action === "price") {
      const quotedPriceMad = Number(body.quotedPriceMad);
      if (!Number.isFinite(quotedPriceMad) || quotedPriceMad < 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }

      const updated: any = await adminTablesDB.updateRow({
        databaseId: adminDatabaseId,
        tableId: deliveriesTableId,
        rowId: deliveryId,
        data: { quoted_price_mad: quotedPriceMad },
      });

      return NextResponse.json({
        delivery: {
          id: updated.$id,
          quotedPriceMad: updated.quoted_price_mad,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin deliveries PATCH failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update delivery",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error), code: error?.code }
          : {}),
      },
      { status: 500 }
    );
  }
}
