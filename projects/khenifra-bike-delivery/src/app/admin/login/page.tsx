"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { account } from "@/lib/appwrite/client";
import { signIn } from "@/lib/appwrite/auth";
import { adminFetch } from "@/lib/appwrite/admin-client";

export default function AdminLoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        await account.get();
        const response = await adminFetch("/api/admin/riders", { cache: "no-store" });
        if (response.ok) window.location.href = "/admin";
      } catch {}
    })();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      await signIn(
        String(form.get("email") || "").trim(),
        String(form.get("password") || "")
      );

      const response = await adminFetch("/api/admin/riders", { cache: "no-store" });
      if (!response.ok) {
        try { await account.deleteSession({ sessionId: "current" }); } catch {}
        setError("هذا الحساب غير مخوّل كحساب إدارة.");
        return;
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err?.message || "تعذر تسجيل دخول الإدارة.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="authPage adminAuthPage">
      <Link href="/" className="authBrand"><BrandMark/></Link>
      <section className="authCard elevatedCard">
        <div className="adminLoginIcon"><ShieldCheck size={30}/></div>
        <span className="status">Khenifra Delivery Admin</span>
        <h1>دخول الإدارة</h1>
        <p className="authIntro">سجّل الدخول بحساب الإدارة المصرّح به فقط.</p>
        <form className="authForm" onSubmit={submit}>
          <label><span><Mail size={16}/>البريد الإلكتروني</span><input name="email" type="email" required autoComplete="email"/></label>
          <label><span><LockKeyhole size={16}/>كلمة المرور</span><input name="password" type="password" required autoComplete="current-password"/></label>
          {error ? <p className="formError">{error}</p> : null}
          <button className="authSubmit" type="submit" disabled={busy}>{busy ? "جارٍ التحقق..." : "دخول الإدارة"}</button>
        </form>
      </section>
    </main>
  );
}
