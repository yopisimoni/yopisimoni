import { ID, Permission, Query, Role } from "appwrite";
import { account, tablesDB } from "@/lib/appwrite/client";

const databaseId =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "khenifra_delivery";
const profilesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";
const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";

export type PreferredLanguage = "ar" | "fr" | "en";

async function getSessionUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const user = await getSessionUser();
  return user?.email ? user : null;
}

export async function signUp({
  fullName,
  phone,
  email,
  password,
  preferredLanguage,
}: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  preferredLanguage: PreferredLanguage;
}) {
  const existing = await getSessionUser();

  if (existing) {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch {
      // Continue and let Appwrite return a useful error if session cleanup fails.
    }
  }

  const user = await account.create({
    userId: ID.unique(),
    email,
    password,
    name: fullName,
  });

  await account.createEmailPasswordSession({ email, password });

  await tablesDB.createRow({
    databaseId,
    tableId: profilesTableId,
    rowId: ID.unique(),
    data: {
      user_id: user.$id,
      full_name: fullName,
      phone,
      preferred_language: preferredLanguage,
      role: "customer",
    },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
    ],
  });

  return user;
}

export async function signIn(email: string, password: string) {
  const existing = await getSessionUser();
  if (existing) {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch {
      // Ignore and continue to login.
    }
  }

  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function signOut() {
  await account.deleteSession({ sessionId: "current" });
}

export async function sendPasswordRecovery(email: string) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : "/reset-password";

  return account.createRecovery({ email, url });
}

export async function resetPassword({
  userId,
  secret,
  password,
}: {
  userId: string;
  secret: string;
  password: string;
}) {
  return account.updateRecovery({
    userId,
    secret,
    password,
  });
}

export async function getMyAccountData() {
  const user = await account.get();
  if (!user.email) {
    throw new Error("Authenticated account required");
  }

  const [profiles, deliveries] = await Promise.all([
    tablesDB.listRows({
      databaseId,
      tableId: profilesTableId,
      queries: [Query.equal("user_id", [user.$id]), Query.limit(1)],
    }),
    tablesDB.listRows({
      databaseId,
      tableId: deliveriesTableId,
      queries: [Query.equal("customer_id", [user.$id]), Query.limit(100)],
    }),
  ]);

  return {
    user,
    profile: profiles.rows[0] || null,
    deliveries: [...deliveries.rows].reverse(),
  };
}
