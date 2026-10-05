import { ID, Permission, Role } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB, listAllRows } from "@/lib/appwrite/admin-server";
import { getUserFromJWT } from "@/lib/appwrite/auth-server";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";
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
    const rating = Number(body.rating);
    const favorite = Boolean(body.favorite);
    const comment = String(body.comment || "").trim().slice(0, 1000);

    if (!deliveryId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    const delivery: any = await adminTablesDB.getRow({
      databaseId: adminDatabaseId,
      tableId: deliveriesTableId,
      rowId: deliveryId,
    });

    if (
      delivery.customer_id !== user.$id ||
      delivery.status !== "delivered" ||
      !delivery.rider_id
    ) {
      return NextResponse.json({ error: "Feedback not allowed" }, { status: 403 });
    }

    const existing = await listAllRows({
      databaseId: adminDatabaseId,
      tableId: feedbackTableId,
    });

    if (existing.rows.some((row: any) => row.delivery_id === deliveryId)) {
      return NextResponse.json({ error: "Feedback already submitted" }, { status: 409 });
    }

    const row: any = await adminTablesDB.createRow({
      databaseId: adminDatabaseId,
      tableId: feedbackTableId,
      rowId: ID.unique(),
      data: {
        delivery_id: deliveryId,
        customer_id: user.$id,
        rider_id: delivery.rider_id,
        rating,
        favorite,
        comment: comment || null,
        created_at: new Date().toISOString(),
      },
      permissions: [
        Permission.read(Role.user(user.$id)),
        Permission.read(Role.user(delivery.rider_id)),
      ],
    });

    return NextResponse.json({ feedback: { id: row.$id } });
  } catch (error: any) {
    console.error("Feedback submit failed:", error);
    return NextResponse.json(
      {
        error: "Failed to submit feedback",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
