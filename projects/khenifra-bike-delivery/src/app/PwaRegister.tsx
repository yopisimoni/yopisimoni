"use client";

import { useEffect } from "react";
import { appwriteClient } from "@/lib/appwrite/client";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    void appwriteClient
      .ping()
      .then(() => {
        console.info("Appwrite connection verified.");
      })
      .catch((error) => {
        console.error("Appwrite connection failed:", error);
      });
  }, []);

  return null;
}
