"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@/lib/appwrite/auth";

export default function AuthNav() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    void getCurrentUser().then(setUser);
  }, []);

  async function logout() {
    try {
      await signOut();
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  }

  if (user === undefined) {
    return <div className="authNavSkeleton" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className="authNav">
        <Link href="/signin" className="authNavLink"><LogIn size={16}/>دخول</Link>
        <Link href="/signup" className="authNavPrimary"><UserRound size={16}/>إنشاء حساب</Link>
      </div>
    );
  }

  return (
    <div className="authNav">
      <Link href="/account" className="authNavPrimary"><UserRound size={16}/>حسابي</Link>
      <button type="button" className="authNavLink authNavButton" onClick={() => void logout()}><LogOut size={16}/>خروج</button>
    </div>
  );
}
