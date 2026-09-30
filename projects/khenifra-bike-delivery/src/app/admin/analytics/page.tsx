"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Award,
  Bike,
  CircleDollarSign,
  Clock3,
  Heart,
  LayoutDashboard,
  PackageCheck,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";

type Summary = {
  totalDeliveries: number;
  completedDeliveries: number;
  totalRevenueMad: number;
  averageDeliveryMinutes: number | null;
  cancelledOrFailed: number;
};

type RiderStat = {
  userId: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  status: string;
  completedCount: number;
  revenueMad: number;
  averageMinutes: number | null;
  averageRating: number | null;
  ratingCount: number;
  favoriteCount: number;
};

type Delivery = {
  id: string;
  orderCode: string;
  status: string;
  riderName: string;
  category: string;
  priceMad: number;
  requestedAt: string;
  deliveredAt: string | null;
  totalMinutes: number | null;
};

export default function AnalyticsPage() {
  const [passcode, setPasscode] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [riders, setRiders] = useState<RiderStat[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
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
      const response = await fetch("/api/admin/analytics", {
        headers: { "x-admin-passcode": code },
        cache: "no-store",
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error("رمز الإدارة غير صحيح");
        throw new Error(json.detail || "تعذر تحميل التحليلات");
      }
      setSummary(json.summary);
      setRiders(json.riderStats || []);
      setDeliveries(json.deliveries || []);
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

  if (!ready) {
    return (
      <main dir="rtl" className="adminPage">
        <div className="adminLogin elevatedCard">
          <span className="status">Khenifra Delivery Analytics</span>
          <h1>لوحة الأداء والأرباح</h1>
          <p>أدخل رمز الإدارة لعرض أداء السائقين والتوصيلات.</p>
          <form onSubmit={login}>
            <label>رمز الإدارة</label>
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "جارٍ التحميل..." : "دخول"}
            </button>
          </form>
          {error ? <p className="formError">{error}</p> : null}
        </div>
      </main>
    );
  }

  const s = summary!;

  return (
    <main dir="rtl" className="adminPage analyticsPage">
      <div className="adminHeader">
        <div>
          <span className="status">Khenifra Delivery Analytics</span>
          <h1>لوحة الأداء والأرباح</h1>
          <p>الأداء المالي، أوقات التوصيل، وترتيب السائقين.</p>
        </div>
        <div className="adminHeaderActions">
          <Link className="adminLinkButton iconButton" href="/admin/deliveries">
            <LayoutDashboard size={17}/>التوصيلات
          </Link>
          <button className="iconButton" onClick={() => void load()}>
            <RefreshCw size={16}/>تحديث
          </button>
        </div>
      </div>

      <div className="kpiGrid analyticsKpis">
        <div className="kpiCard"><span className="kpiIcon blue"><TrendingUp/></span><div><small>كل الطلبات</small><strong>{s.totalDeliveries}</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon green"><PackageCheck/></span><div><small>تم تسليمها</small><strong>{s.completedDeliveries}</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon amber"><CircleDollarSign/></span><div><small>إجمالي قيمة التوصيل</small><strong>{s.totalRevenueMad.toFixed(0)} MAD</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon blue"><Clock3/></span><div><small>متوسط الوقت</small><strong>{s.averageDeliveryMinutes ?? "—"}{s.averageDeliveryMinutes ? " د" : ""}</strong></div></div>
      </div>

      <section className="analyticsSection">
        <div className="sectionTitleIcon"><Award size={21}/><h2>ترتيب السائقين</h2></div>
        <p className="analyticsHint">الترتيب يبدأ بالمفضلة والتقييم، ثم عدد التوصيلات، ثم سرعة الإنجاز. إذا لم توجد تقييمات بعد فلن نخترع تقييماً.</p>

        <div className="rankingList">
          {riders.map((rider, index) => (
            <article className="rankingCard" key={rider.userId}>
              <div className="rankNumber">#{index + 1}</div>
              <div className="rankDriver">
                <div className="riderAvatar"><Bike size={21}/></div>
                <div><strong>{rider.fullName}</strong><small>{rider.vehicleType === "motorbike" ? "دراجة نارية" : "دراجة هوائية"}</small></div>
              </div>
              <div className="rankMetric"><PackageCheck/><span>توصيلات</span><strong>{rider.completedCount}</strong></div>
              <div className="rankMetric"><Clock3/><span>متوسط الوقت</span><strong>{rider.averageMinutes == null ? "—" : rider.averageMinutes + " د"}</strong></div>
              <div className="rankMetric"><CircleDollarSign/><span>قيمة التوصيلات</span><strong>{rider.revenueMad.toFixed(0)} MAD</strong></div>
              <div className="rankMetric"><Star/><span>التقييم</span><strong>{rider.averageRating == null ? "—" : rider.averageRating + "/5"}</strong></div>
              <div className="rankMetric"><Heart/><span>مفضلة</span><strong>{rider.favoriteCount}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="analyticsSection">
        <div className="sectionTitleIcon"><CircleDollarSign size={21}/><h2>كل التوصيلات والأسعار</h2></div>
        <div className="analyticsTableWrap">
          <table className="analyticsTable">
            <thead>
              <tr>
                <th>الطلب</th>
                <th>السائق</th>
                <th>الحالة</th>
                <th>السعر</th>
                <th>الوقت</th>
                <th>تاريخ الطلب</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td><strong>{delivery.orderCode}</strong></td>
                  <td>{delivery.riderName || "—"}</td>
                  <td>{delivery.status}</td>
                  <td><strong>{delivery.priceMad.toFixed(0)} MAD</strong></td>
                  <td>{delivery.totalMinutes == null ? "—" : delivery.totalMinutes + " دقيقة"}</td>
                  <td>{new Date(delivery.requestedAt).toLocaleString("ar-MA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
