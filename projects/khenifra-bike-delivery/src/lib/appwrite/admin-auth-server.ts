import { NextRequest } from "next/server";
import { getUserFromJWT } from "@/lib/appwrite/auth-server";

function allowedAdminEmails() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAuthorizedAdmin(request: NextRequest) {
  const jwt = request.headers.get("x-appwrite-jwt");
  if (!jwt) return null;

  try {
    const user = await getUserFromJWT(jwt);
    const email = String(user.email || "").trim().toLowerCase();
    if (!email) return null;

    return allowedAdminEmails().includes(email) ? user : null;
  } catch {
    return null;
  }
}
