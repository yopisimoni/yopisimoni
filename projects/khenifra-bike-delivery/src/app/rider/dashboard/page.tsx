"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bike, CheckCircle2, Clock3, MapPin, Navigation, Package, Power, RefreshCw } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { getMyRiderState, setRiderAvailability } from "@/lib/appwrite/rider-location";

type DeliveryRow = {
  $id: string;
  order_code: string;
  status: string;
  pickup_address: string;
  dropoff_address: string;
  quoted_price_mad?: number | null;
};

export default function RiderDashboard() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setState(await getMyRiderState());
    } catch {
      setError("تعذر تحميل حساب السائق. افتح صفحة الانضمام أولاً من هذا الجهاز.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function goOnline() {
    if (!navigator.geolocation) {
      setError("الموقع الجغرافي غير مدعوم على هذا الجهاز.");
      return;
    }
    setBusy(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await setRiderAvailability({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isAvailable: true,
          });
          await load();
        } catch (err) {
          console.error(err);
          setError("تعذر حفظ موقعك. تأكد من إعداد جدول المواقع ومنح إذن الموقع.");
        } finally {
          setBusy(false);
        }
      },
      () => {
        setError("لم يتم منح إذن الموقع. نحتاج موقعك فقط عندما تختار أن تكون متاحاً.");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  async function goOffline() {
    if (!state?.location) return;
    setBusy(true);
    try {
      await setRiderAvailability({
        lat: state.location.lat,
        lng: state.location.lng,
        isAvailable: false,
      });
      await load();
    } catch {
      setError("تعذر تغيير حالة التوفر.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main dir="rtl" className="riderDashboard"><div className="loadingCard"><Bike/><span>جارٍ تحميل حساب السائق...</span></div></main>;

  const rider = state?.rider;
  const available = Boolean(state?.location?.is_available);
  const deliveries: DeliveryRow[] = state?.deliveries || [];

  return (
    <main dir="rtl" className="riderDashboard">
      <nav className="nav">
        <Link href="/"><BrandMark/></Link>
        <button className="refreshIconButton" onClick={() => void load()}><RefreshCw size={18}/></button>
      </nav>

      <section className="riderDashHero">
        <div>
          <span className="status">لوحة السائق</span>
          <h1>جاهز للتوصيل؟</h1>
          <p>شارك موقعك فقط عندما تكون متاحاً. سنستخدمه لاختيار أقرب سائق إلى نقطة الاستلام.</p>
        </div>
        <div className={"availabilityCard " + (available ? "online" : "offline")}>
          <span className="availabilityDot"></span>
          <strong>{available ? "متاح الآن" : "غير متاح"}</strong>
          <button disabled={busy || rider?.status !== "approved"} onClick={() => void (available ? goOffline() : goOnline())}>
            <Power size={18}/>{busy ? "..." : available ? "إيقاف التوفر" : "ابدأ استقبال الطلبات"}
          </button>
        </div>
      </section>

      {rider?.status !== "approved" ? (
        <div className="riderNotice"><Clock3 size={22}/><div><strong>حسابك لم يُفعّل بعد</strong><span>يمكنك استقبال الطلبات بعد موافقة الإدارة.</span></div></div>
      ) : null}
      {error ? <p className="formError">{error}</p> : null}

      <section className="riderJobs">
        <div className="sectionTitleIcon"><Package size={20}/><h2>طلباتي</h2></div>
        {deliveries.length === 0 ? (
          <div className="emptyAdmin visualEmpty"><CheckCircle2 size={30}/><strong>لا توجد مهمة حالياً</strong><span>عندما يتم تعيين طلب لك سيظهر هنا.</span></div>
        ) : deliveries.map((delivery) => (
          <article className="riderJobCard" key={delivery.$id}>
            <div className="riderJobHead"><strong>{delivery.order_code}</strong><span className="deliveryStatus">{delivery.status}</span></div>
            <div className="riderJobRoute">
              <div><MapPin/><small>الاستلام</small><strong>{delivery.pickup_address}</strong></div>
              <Navigation className="routeMidIcon"/>
              <div><Navigation/><small>التسليم</small><strong>{delivery.dropoff_address}</strong></div>
            </div>
            {typeof delivery.quoted_price_mad === "number" ? <div className="riderPrice">{delivery.quoted_price_mad} درهم</div> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
