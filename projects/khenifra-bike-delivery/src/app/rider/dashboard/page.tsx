"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bike,
  CheckCircle2,
  Clock3,
  KeyRound,
  MapPin,
  Navigation,
  Package,
  Power,
  RefreshCw,
  Route,
  Truck,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import {
  getMyRiderState,
  setRiderAvailability,
  updateAssignedDelivery,
} from "@/lib/appwrite/rider-location";

type DeliveryRow = {
  $id: string;
  order_code: string;
  status: string;
  pickup_address: string;
  dropoff_address: string;
  quoted_price_mad?: number | null;
};

const labels: Record<string, string> = {
  assigned: "طلب جديد مسند لك",
  rider_to_pickup: "في الطريق إلى الاستلام",
  picked_up: "تم الاستلام",
  rider_to_dropoff: "في الطريق إلى الزبون",
  delivered: "تم التسليم",
  cancelled: "ملغى",
  failed: "فشل التسليم",
};

function actionLabel(status: string) {
  if (status === "assigned") return "قبول والذهاب للاستلام";
  if (status === "rider_to_pickup") return "تأكيد استلام الطلب";
  if (status === "picked_up") return "ابدأ التوصيل للزبون";
  return "";
}

export default function RiderDashboard() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyDelivery, setBusyDelivery] = useState("");
  const [pins, setPins] = useState<Record<string, string>>({});
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

  useEffect(() => {
    if (!state?.location?.is_available || !navigator.geolocation) return;

    let lastSent = 0;
    let lastLat = Number(state.location.lat);
    let lastLng = Number(state.location.lng);

    const distanceMeters = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371000;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(a));
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        const moved = distanceMeters(
          lastLat,
          lastLng,
          position.coords.latitude,
          position.coords.longitude
        );

        if (now - lastSent < 15000 && moved < 20) return;

        lastSent = now;
        lastLat = position.coords.latitude;
        lastLng = position.coords.longitude;

        void setRiderAvailability({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isAvailable: true,
        }).catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [state?.location?.is_available]);

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
            accuracy: position.coords.accuracy,
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
        accuracy: state.location.accuracy,
      });
      await load();
    } catch {
      setError("تعذر تغيير حالة التوفر.");
    } finally {
      setBusy(false);
    }
  }

  async function advance(deliveryId: string) {
    setBusyDelivery(deliveryId);
    setError("");
    try {
      await updateAssignedDelivery(deliveryId, "advance");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحديث الطلب.");
    } finally {
      setBusyDelivery("");
    }
  }

  async function deliver(deliveryId: string) {
    const pin = (pins[deliveryId] || "").trim();
    if (!/^\d{4}$/.test(pin)) {
      setError("أدخل رمز التسليم المكوّن من 4 أرقام.");
      return;
    }
    setBusyDelivery(deliveryId);
    setError("");
    try {
      await updateAssignedDelivery(deliveryId, "deliver", pin);
      setPins((current) => ({ ...current, [deliveryId]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "رمز التسليم غير صحيح.");
    } finally {
      setBusyDelivery("");
    }
  }

  if (loading) {
    return (
      <main dir="rtl" className="riderDashboard">
        <div className="loadingCard"><Bike/><span>جارٍ تحميل حساب السائق...</span></div>
      </main>
    );
  }

  const rider = state?.rider;
  const available = Boolean(state?.location?.is_available);
  const deliveries: DeliveryRow[] = (state?.deliveries || []).filter(
    (delivery: DeliveryRow) => !["cancelled", "failed"].includes(delivery.status)
  );

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
          <p>شارك موقعك فقط عندما تكون متاحاً. عند إسناد مهمة لك ستتمكن من تنفيذها من هنا خطوة بخطوة.</p>
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
      {error ? <p className="formError riderDashError">{error}</p> : null}

      <section className="riderJobs">
        <div className="sectionTitleIcon"><Package size={20}/><h2>طلباتي</h2></div>

        {deliveries.length === 0 ? (
          <div className="emptyAdmin visualEmpty">
            <CheckCircle2 size={30}/><strong>لا توجد مهمة حالياً</strong><span>عندما يتم تعيين طلب لك سيظهر هنا.</span>
          </div>
        ) : deliveries.map((delivery) => {
          const finished = delivery.status === "delivered";
          return (
            <article className={"riderJobCard " + (finished ? "finishedJob" : "")} key={delivery.$id}>
              <div className="riderJobHead">
                <strong>{delivery.order_code}</strong>
                <span className={"deliveryStatus deliveryStatus-" + delivery.status}>
                  {labels[delivery.status] || delivery.status}
                </span>
              </div>

              <div className="riderProgress">
                <span className={["assigned","rider_to_pickup","picked_up","rider_to_dropoff","delivered"].includes(delivery.status) ? "done" : ""}><Bike/></span>
                <i></i>
                <span className={["picked_up","rider_to_dropoff","delivered"].includes(delivery.status) ? "done" : ""}><Package/></span>
                <i></i>
                <span className={["rider_to_dropoff","delivered"].includes(delivery.status) ? "done" : ""}><Truck/></span>
                <i></i>
                <span className={delivery.status === "delivered" ? "done" : ""}><CheckCircle2/></span>
              </div>

              <div className="riderJobRoute">
                <div><MapPin/><small>الاستلام</small><strong>{delivery.pickup_address}</strong></div>
                <Route className="routeMidIcon"/>
                <div><Navigation/><small>التسليم</small><strong>{delivery.dropoff_address}</strong></div>
              </div>

              {typeof delivery.quoted_price_mad === "number" ? (
                <div className="riderPrice">{delivery.quoted_price_mad} درهم</div>
              ) : null}

              {!finished && delivery.status !== "rider_to_dropoff" && actionLabel(delivery.status) ? (
                <button
                  className="riderPrimaryAction"
                  disabled={busyDelivery === delivery.$id}
                  onClick={() => void advance(delivery.$id)}
                >
                  {delivery.status === "assigned" ? <Bike size={18}/> : delivery.status === "rider_to_pickup" ? <Package size={18}/> : <Truck size={18}/>}
                  {busyDelivery === delivery.$id ? "..." : actionLabel(delivery.status)}
                </button>
              ) : null}

              {delivery.status === "rider_to_dropoff" ? (
                <div className="pinDeliveryBox">
                  <div><KeyRound size={20}/><strong>تأكيد التسليم</strong></div>
                  <p>اطلب من الزبون رمز التسليم المكوّن من 4 أرقام.</p>
                  <div className="pinActionRow">
                    <input
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="0000"
                      value={pins[delivery.$id] || ""}
                      onChange={(event) =>
                        setPins((current) => ({
                          ...current,
                          [delivery.$id]: event.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                    />
                    <button
                      disabled={busyDelivery === delivery.$id}
                      onClick={() => void deliver(delivery.$id)}
                    >
                      <CheckCircle2 size={18}/>
                      {busyDelivery === delivery.$id ? "..." : "تأكيد التسليم"}
                    </button>
                  </div>
                </div>
              ) : null}

              {finished ? (
                <div className="deliveryCompleteBadge"><CheckCircle2 size={18}/>تم تسليم الطلب بنجاح</div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
