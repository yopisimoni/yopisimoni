"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Languages, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { signUp, type PreferredLanguage } from "@/lib/appwrite/auth";

export default function SignUpPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");

    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      setBusy(false);
      return;
    }

    try {
      await signUp({
        fullName: String(form.get("fullName") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        email: String(form.get("email") || "").trim(),
        password,
        preferredLanguage: String(form.get("language") || "ar") as PreferredLanguage,
      });
      window.location.href = "/account";
    } catch (err: any) {
      setError(
        err?.message ||
          "تعذر إنشاء الحساب. تحقق من البريد الإلكتروني وكلمة المرور وحاول مرة أخرى."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="authPage">
      <Link href="/" className="authBrand"><BrandMark/></Link>
      <section className="authCard elevatedCard">
        <span className="status">حساب جديد</span>
        <h1>إنشاء حساب</h1>
        <p className="authIntro">احفظ طلباتك، تابع التوصيلات، وقيّم السائق بعد التسليم.</p>

        <form className="authForm" onSubmit={submit}>
          <label><span><UserRound size={16}/>الاسم الكامل</span><input name="fullName" required autoComplete="name"/></label>
          <label><span><Phone size={16}/>رقم الهاتف</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="06XXXXXXXX"/></label>
          <label><span><Mail size={16}/>البريد الإلكتروني</span><input name="email" required type="email" autoComplete="email"/></label>
          <label>
            <span><LockKeyhole size={16}/>كلمة المرور</span>
            <div className="passwordField">
              <input name="password" required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password"/>
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="إظهار أو إخفاء كلمة المرور">
                {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
              </button>
            </div>
          </label>
          <label><span><LockKeyhole size={16}/>تأكيد كلمة المرور</span><input name="confirmPassword" required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password"/></label>
          <label><span><Languages size={16}/>اللغة المفضلة</span>
            <select name="language" defaultValue="ar">
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>

          {error ? <p className="formError">{error}</p> : null}
          <button className="authSubmit" type="submit" disabled={busy}>{busy ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}</button>
        </form>

        <p className="authSwitch">لديك حساب؟ <Link href="/signin">تسجيل الدخول</Link></p>
      </section>
    </main>
  );
}
