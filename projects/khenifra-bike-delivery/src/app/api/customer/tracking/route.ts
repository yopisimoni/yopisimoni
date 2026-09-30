import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB } from "@/lib/appwrite/admin-server";
import { getUserFromJWT } from "@/lib/appwrite/auth-server";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";
const profilesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const locationsTableId = "rider_locations";
const feedbackTableId = "delivery_feedback";

async function authenticate(request: NextRequest) {
  const jwt = request.headers.get("x-appwrite-jwt");
  if (!jwt) return null;
  try {
    return await getUserFromJWT(jwt);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const deliveryId = String(body.deliveryId || "");
    if (!deliveryId) {
      return NextResponse.json({ error: "Missing deliveryId" }, { status: 400 });
    }

    const delivery: any = await adminTablesDB.getRow({
      databaseId: adminDatabaseId,
      tableId: deliveriesTableId,
      rowId: deliveryId,
    });

    if (delivery.customer_id !== user.$id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let rider = null;
    let location = null;

    if (delivery.rider_id) {
      const [profiles, riders, locations] = await Promise.all([
        adminTablesDB.listRows({
          databaseId: adminDatabaseId,
          tableId: profilesTableId,
        }),
        adminTablesDB.listRows({
          databaseId: adminDatabaseId,
          tableId: ridersTableId,
        }),
        adminTablesDB.listRows({
          databaseId: adminDatabaseId,
          tableId: locationsTableId,
        }),
      ]);

      const profile: any = profiles.rows.find(
        (row: any) => row.user_id === delivery.rider_id
      );
      const riderRow: any = riders.rows.find(
        (row: any) => row.user_id === delivery.rider_id
      );
      const locationRow: any = locations.rows.find(
        (row: any) => row.user_id === delivery.rider_id
      );

      rider = {
        name: profile?.full_name || "السائق",
        vehicleType: riderRow?.vehicle_type || "bike",
      };

      if (
        locationRow &&
        ["assigned", "rider_to_pickup", "picked_up", "rider_to_dropoff"].includes(
          delivery.status
        )
      ) {
        const updatedMs = new Date(locationRow.updated_at).getTime();
        location = {
          lat: locationRow.lat,
          lng: locationRow.lng,
          accuracy: locationRow.accuracy ?? null,
          updatedAt: locationRow.updated_at,
          fresh: Number.isFinite(updatedMs) && Date.now() - updatedMs <= 2 * 60 * 1000,
        };
      }
    }

    let feedbackSubmitted = false;
    try {
      const feedback = await adminTablesDB.listRows({
        databaseId: adminDatabaseId,
        tableId: feedbackTableId,
      });
      feedbackSubmitted = feedback.rows.some(
        (row: any) => row.delivery_id === deliveryId
      );
    } catch {}

    return NextResponse.json({
      delivery: {
        id: delivery.$id,
        orderCode: delivery.order_code,
        status: delivery.status,
        pickupAddress: delivery.pickup_address,
        dropoffAddress: delivery.dropoff_address,
        priceMad:
          typeof delivery.final_price_mad === "number"
            ? delivery.final_price_mad
            : delivery.quoted_price_mad ?? null,
        requestedAt: delivery.requested_at,
        deliveredAt: delivery.delivered_at || null,
      },
      rider,
      location,
      feedbackSubmitted,
    });
  } catch (error: any) {
    console.error("Customer tracking failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load tracking",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
