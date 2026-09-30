"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Rider = {
  id: string;
  userId: string;
  status: "pending" | "approved" | "suspended";
  isOnline: boolean;
  vehicleType: "bike" | "motorbike";
  createdAt: string;
  fullName: string;
  phone: string;
  preferredLanguage: string;
};

export default function AdminRidersPage() {
  const [passcode, setPasscode] = useState("");
  const [riders, setRiders] = useState<Rider[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("kbd-admin-passcode") || "";
    if (saved) {
      setPasscode(saved);
      void load(saved);
    }
  }, []);

  async function load(code = passcode) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/riders", {
        headers: { "x-admin-passcode": code },
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("رمز الإدارة غير صحيح");
        throw new Error("تعذر تحميل طلبات السائقين");
      }
      const json = await response.json();
      setRiders(json.riders || []);
      sessionStorage.setItem("kbd-admin-passcode", code);
      setReady(true);
    } catch (err) {
      setReady(false);
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    await load(passcode);
  }

  async function changeStatus(rowId: string, status: Rider["status"]) {
    setError("");
    const response = await fetch("/api/admin/riders", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-passcode": passcode,
      },
      body: JSON.stringify({ rowId, status }),
    });

    if (!response.ok) {
      setError("تعذر تحديث حالة السائق");
      return;
    }

    setRiders((current) =>
      current.map((rider) => rider.id === rowId ? { ...rider, status } : rider)
    );
  }

  const pending = riders.filter((rider) => rider.status === "pending");
  const reviewed = riders.filter((rider) => rider.status !== "pending");

  if (!ready) {
    return (
      <main dir="rtl" className="adminPage">
        <div className="adminLogin">
          <span className="status">Khenifra Delivery Admin</span>
          <h1>لوحة إدارة السائقين</h1>
          <p>أدخل رمز الإدارة لعرض طلبات الانضمام.</p>
          <form onSubmit={login}>
            <label>رمز الإدارة</label>
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="submit" disabled={loading}>
              {loading ? "جارٍ التحقق..." : "دخول"}
            </button>
          </form>
          {error ? <p className="formError">{error}</p> : null}
          <Link href="/" className="textLink">العودة للرئيسية</Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="adminPage">
      <div className="adminHeader">
        <div>
          <span className="status">Khenifra Delivery Admin</span>
          <h1>طلبات السائقين</h1>
          <p>{pending.length} طلب بانتظار المراجعة · {riders.length} إجمالي السائقين</p>
        </div>
        <div className="adminHeaderActions">
          <button onClick={() => void load()}>تحديث</button>
          <button
            className="secondaryAdminButton"
            onClick={() => {
              sessionStorage.removeItem("kbd-admin-passcode");
              setPasscode("");
              setReady(false);
              setRiders([]);
            }}
          >
            خروج
          </button>
        </div>
      </div>

      {error ? <p className="formError">{error}</p> : null}

      <section className="adminSection">
        <h2>بانتظار الموافقة</h2>
        {pending.length === 0 ? (
          <div className="emptyAdmin">لا توجد طلبات معلقة.</div>
        ) : (
          <div className="adminGrid">
            {pending.map((rider) => (
              <article className="riderAdminCard" key={rider.id}>
                <div className="riderAdminTop">
                  <strong>{rider.fullName || "بدون اسم"}</strong>
                  <span className="pendingPill">قيد المراجعة</span>
                </div>
                <p><b>الهاتف:</b> {rider.phone || "—"}</p>
                <p><b>المركبة:</b> {rider.vehicleType === "motorbike" ? "دراجة نارية" : "دراجة هوائية"}</p>
                <p><b>اللغة:</b> {rider.preferredLanguage}</p>
                <div className="adminCardActions">
                  <button onClick={() => void changeStatus(rider.id, "approved")}>موافقة</button>
                  <button className="dangerButton" onClick={() => void changeStatus(rider.id, "suspended")}>تعليق</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="adminSection">
        <h2>تمت المراجعة</h2>
        <div className="adminGrid">
          {reviewed.map((rider) => (
            <article className="riderAdminCard" key={rider.id}>
              <div className="riderAdminTop">
                <strong>{rider.fullName || "بدون اسم"}</strong>
                <span className={rider.status === "approved" ? "approvedPill" : "suspendedPill"}>
                  {rider.status === "approved" ? "مقبول" : "معلّق"}
                </span>
              </div>
              <p><b>الهاتف:</b> {rider.phone || "—"}</p>
              <p><b>المركبة:</b> {rider.vehicleType === "motorbike" ? "دراجة نارية" : "دراجة هوائية"}</p>
              <div className="adminCardActions">
                {rider.status === "approved" ? (
                  <button className="dangerButton" onClick={() => void changeStatus(rider.id, "suspended")}>تعليق</button>
                ) : (
                  <button onClick={() => void changeStatus(rider.id, "approved")}>إعادة التفعيل</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Link href="/" className="textLink">← العودة للموقع</Link>
    </main>
  );
}
