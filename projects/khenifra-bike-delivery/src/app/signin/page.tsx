"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { signIn } from "@/lib/appwrite/auth";

export default function SignInPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      window.location.href = "/account";
    } catch (err: any) {
      setError(err?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="authPage">
      <Link href="/" className="authBrand"><BrandMark/></Link>
      <section className="authCard elevatedCard">
        <span className="status">مرحباً بعودتك</span>
        <h1>تسجيل الدخول</h1>
        <p className="authIntro">ادخل إلى حسابك لمتابعة طلباتك وتاريخ التوصيل.</p>

        <form className="authForm" onSubmit={submit}>
          <label><span><Mail size={16}/>البريد الإلكتروني</span><input name="email" required type="email" autoComplete="email"/></label>
          <label>
            <span><LockKeyhole size={16}/>كلمة المرور</span>
            <div className="passwordField">
              <input name="password" required type={showPassword ? "text" : "password"} autoComplete="current-password"/>
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="إظهار أو إخفاء كلمة المرور">
                {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
              </button>
            </div>
          </label>

          <div className="authForgotRow"><Link href="/forgot-password">نسيت كلمة المرور؟</Link></div>
          {error ? <p className="formError">{error}</p> : null}
          <button className="authSubmit" type="submit" disabled={busy}>{busy ? "جارٍ الدخول..." : "تسجيل الدخول"}</button>
        </form>

        <p className="authSwitch">ليس لديك حساب؟ <Link href="/signup">إنشاء حساب</Link></p>
      </section>
    </main>
  );
}
