"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import { resetPassword } from "@/lib/appwrite/auth";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const userId = useMemo(() => params.get("userId") || "", [params]);
  const secret = useMemo(() => params.get("secret") || "", [params]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");

    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (!userId || !secret) {
      setError("رابط الاسترجاع غير صالح أو ناقص.");
      return;
    }

    setBusy(true);
    try {
      await resetPassword({ userId, secret, password });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "تعذر تغيير كلمة المرور. قد يكون الرابط منتهياً.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="authPage">
      <Link href="/" className="authBrand"><BrandMark/></Link>
      <section className="authCard elevatedCard">
        {done ? (
          <div className="authSuccess">
            <CheckCircle2 size={46}/>
            <h1>تم تغيير كلمة المرور</h1>
            <p>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
            <Link className="authSubmit authLinkButton" href="/signin">تسجيل الدخول</Link>
          </div>
        ) : (
          <>
            <span className="status">كلمة مرور جديدة</span>
            <h1>إعادة تعيين كلمة المرور</h1>
            <form className="authForm" onSubmit={submit}>
              <label><span><LockKeyhole size={16}/>كلمة المرور الجديدة</span><input name="password" required minLength={8} type="password" autoComplete="new-password"/></label>
              <label><span><LockKeyhole size={16}/>تأكيد كلمة المرور</span><input name="confirmPassword" required minLength={8} type="password" autoComplete="new-password"/></label>
              {error ? <p className="formError">{error}</p> : null}
              <button className="authSubmit" type="submit" disabled={busy}>{busy ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
