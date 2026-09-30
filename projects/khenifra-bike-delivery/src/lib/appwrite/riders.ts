import { ID, Permission, Role } from "appwrite";
import { account, tablesDB } from "@/lib/appwrite/client";

const databaseId =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "khenifra_delivery";
const profilesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";

async function getOrCreateUser() {
  try {
    return await account.get();
  } catch {
    await account.createAnonymousSession();
    return account.get();
  }
}

export type RiderApplicationInput = {
  fullName: string;
  phone: string;
  preferredLanguage: "ar" | "fr" | "en";
  vehicleType: "bike" | "motorbike";
};

export async function applyAsRider(input: RiderApplicationInput) {
  const user = await getOrCreateUser();
  const profilePermissions = [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
  ];
  const riderPermissions = [
    Permission.read(Role.user(user.$id)),
  ];

  let profile;
  try {
    profile = await tablesDB.createRow({
      databaseId,
      tableId: profilesTableId,
      rowId: ID.unique(),
      data: {
        user_id: user.$id,
        full_name: input.fullName,
        phone: input.phone,
        preferred_language: input.preferredLanguage,
        role: "rider",
      },
      permissions: profilePermissions,
    });
  } catch (error: any) {
    if (error?.code !== 409) throw error;
  }

  const rider = await tablesDB.createRow({
    databaseId,
    tableId: ridersTableId,
    rowId: ID.unique(),
    data: {
      user_id: user.$id,
      status: "pending",
      is_online: false,
      vehicle_type: input.vehicleType,
    },
    permissions: riderPermissions,
  });

  return { userId: user.$id, riderId: rider.$id, profile };
}
