"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { sendPasswordRecovery } from "@/lib/appwrite/auth";

export default function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      await sendPasswordRecovery(String(form.get("email") || "").trim());
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "تعذر إرسال رابط استرجاع كلمة المرور.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="authPage">
      <Link href="/" className="authBrand"><BrandMark/></Link>
      <section className="authCard elevatedCard">
        {sent ? (
          <div className="authSuccess">
            <CheckCircle2 size={46}/>
            <h1>تحقق من بريدك</h1>
            <p>إذا كان الحساب موجوداً، ستصلك رسالة تحتوي على رابط لاختيار كلمة مرور جديدة.</p>
            <Link className="authSubmit authLinkButton" href="/signin">العودة لتسجيل الدخول</Link>
          </div>
        ) : (
          <>
            <span className="status">استرجاع الحساب</span>
            <h1>نسيت كلمة المرور؟</h1>
            <p className="authIntro">أدخل بريد حسابك وسنرسل لك رابط إعادة تعيين كلمة المرور.</p>
            <form className="authForm" onSubmit={submit}>
              <label><span><Mail size={16}/>البريد الإلكتروني</span><input name="email" required type="email" autoComplete="email"/></label>
              {error ? <p className="formError">{error}</p> : null}
              <button className="authSubmit" type="submit" disabled={busy}>{busy ? "جارٍ الإرسال..." : "إرسال رابط الاسترجاع"}</button>
            </form>
            <p className="authSwitch"><Link href="/signin">العودة لتسجيل الدخول</Link></p>
          </>
        )}
      </section>
    </main>
  );
}
