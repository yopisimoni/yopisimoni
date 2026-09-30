import { account } from "@/lib/appwrite/client";

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const jwt = await account.createJWT();

  return fetch(input, {
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      "x-appwrite-jwt": jwt.jwt,
      ...(init.headers || {}),
    },
  });
}
