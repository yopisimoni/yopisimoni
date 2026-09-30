import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB } from "@/lib/appwrite/admin-server";
import { getUserFromJWT } from "@/lib/appwrite/auth-server";
import { deliveryPin } from "@/lib/delivery-pin";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";

export async function POST(request: NextRequest) {
  const jwt = request.headers.get("x-appwrite-jwt");
  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = await getUserFromJWT(jwt);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const deliveryId = String(body.deliveryId || "");

    const delivery: any = await adminTablesDB.getRow({
      databaseId: adminDatabaseId,
      tableId: deliveriesTableId,
      rowId: deliveryId,
    });

    if (delivery.customer_id !== user.$id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ pin: deliveryPin(deliveryId) });
  } catch (error: any) {
    console.error("Customer PIN request failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate delivery PIN",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
