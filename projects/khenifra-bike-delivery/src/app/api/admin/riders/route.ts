import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB } from "@/lib/appwrite/admin-server";
import { getAuthorizedAdmin } from "@/lib/appwrite/admin-auth-server";

const ridersTableId = process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const profilesTableId = process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";

export async function GET(request: NextRequest) {
  const admin = await getAuthorizedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [riders, profiles] = await Promise.all([
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

    const data = riders.rows.map((rider: any) => {
      const profile: any = profileByUser.get(rider.user_id);
      return {
        id: rider.$id,
        userId: rider.user_id,
        status: rider.status,
        isOnline: rider.is_online,
        vehicleType: rider.vehicle_type,
        createdAt: rider.$createdAt,
        fullName: profile?.full_name || "",
        phone: profile?.phone || "",
        preferredLanguage: profile?.preferred_language || "ar",
      };
    });

    return NextResponse.json({ riders: data });
  } catch (error: any) {
    console.error("Admin riders GET failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load riders",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error), code: error?.code }
          : {}),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAuthorizedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rowId = String(body.rowId || "");
    const status = String(body.status || "");

    if (!rowId || !["approved", "suspended", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const rider = await adminTablesDB.updateRow({
      databaseId: adminDatabaseId,
      tableId: ridersTableId,
      rowId,
      data: { status },
    });

    return NextResponse.json({
      rider: {
        id: rider.$id,
        status: rider.status,
      },
    });
  } catch (error: any) {
    console.error("Admin riders PATCH failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update rider",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error), code: error?.code }
          : {}),
      },
      { status: 500 }
    );
  }
}
