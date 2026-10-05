"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  Bike,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Navigation,
  Package,
  RefreshCw,
  Star,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { account } from "@/lib/appwrite/client";

const labels: Record<string, string> = {
  requested: "تم استلام طلبك",
  assigned: "تم تعيين سائق",
  rider_to_pickup: "السائق في الطريق إلى الاستلام",
  picked_up: "تم استلام الطلب",
  rider_to_dropoff: "السائق في الطريق إليك",
  delivered: "تم التسليم",
  cancelled: "تم إلغاء الطلب",
  failed: "تعذر إتمام التوصيل",
};

export default function TrackDeliveryPage() {
  const params = useParams<{ id: string }>();
  const deliveryId = params.id;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [favorite, setFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  async function authFetch(url: string, options: RequestInit = {}) {
    const jwt = await account.createJWT();
    return fetch(url, {
      ...options,
      headers: {
        "content-type": "application/json",
        "x-appwrite-jwt": jwt.jwt,
        ...(options.headers || {}),
      },
    });
  }

  async function load() {
    try {
      const response = await authFetch("/api/customer/tracking", {
        method: "POST",
        body: JSON.stringify({ deliveryId }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "تعذر تحميل التتبع");
      setData(json);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل التتبع");
    }
  }

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 10000);
    return () => window.clearInterval(timer);
  }, [deliveryId]);

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await authFetch("/api/customer/feedback", {
        method: "POST",
        body: JSON.stringify({ deliveryId, rating, favorite, comment }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "تعذر إرسال التقييم");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إرسال التقييم");
    } finally {
      setSending(false);
    }
  }

  if (!data) {
    return (
      <main dir="rtl" className="trackingPage">
        <nav className="nav"><Link href="/"><BrandMark/></Link></nav>
        <div className="loadingCard"><Bike/><span>{error || "جارٍ تحميل التوصيل..."}</span></div>
      </main>
    );
  }

  const delivery = data.delivery;
  const locationAge = data.location?.updatedAt
    ? Math.max(0, Math.round((Date.now() - new Date(data.location.updatedAt).getTime()) / 1000))
    : null;

  return (
    <main dir="rtl" className="trackingPage">
      <nav className="nav trackingNav">
        <Link href="/"><BrandMark/></Link>
        <button className="refreshIconButton" onClick={() => void load()}><RefreshCw size={18}/></button>
      </nav>

      <section className="trackingHero">
        <span className="status">{delivery.orderCode}</span>
        <h1>{labels[delivery.status] || delivery.status}</h1>
        <div className="trackingTimeline">
          {["assigned","rider_to_pickup","picked_up","rider_to_dropoff","delivered"].map((status, index) => {
            const order = ["requested","assigned","rider_to_pickup","picked_up","rider_to_dropoff","delivered"];
            const done = order.indexOf(delivery.status) >= order.indexOf(status);
            return <span className={done ? "done" : ""} key={status}>{index === 4 ? <CheckCircle2/> : <span>{index + 1}</span>}</span>;
          })}
        </div>
      </section>

      <div className="trackingGrid">
        <section className="trackingCard">
          <div className="sectionTitleIcon"><Package size={20}/><h2>تفاصيل الطلب</h2></div>
          <div className="trackingRoute">
            <div><MapPin/><span><small>الاستلام</small><strong>{delivery.pickupAddress}</strong></span></div>
            <div><Navigation/><span><small>التسليم</small><strong>{delivery.dropoffAddress}</strong></span></div>
          </div>
          <div className="trackingMeta">
            <span><Clock3 size={15}/>{new Date(delivery.requestedAt).toLocaleString("ar-MA")}</span>
            <strong>{delivery.priceMad == null ? "السعر قيد التحديد" : delivery.priceMad + " MAD"}</strong>
          </div>
        </section>

        <section className="trackingCard riderTrackingCard">
          <div className="sectionTitleIcon"><Bike size={20}/><h2>السائق</h2></div>
          {data.rider ? (
            <>
              <div className="trackingRider"><div className="riderAvatar"><Bike/></div><div><strong>{data.rider.name}</strong><span>{data.rider.vehicleType === "motorbike" ? "دراجة نارية" : "دراجة هوائية"}</span></div></div>
              {data.location ? (
                <div className={"lastLocation " + (data.location.fresh ? "fresh" : "stale")}>
                  <MapPin size={18}/>
                  <div>
                    <strong>{data.location.fresh ? "آخر موقع للسائق حديث" : "آخر موقع قديم نسبياً"}</strong>
                    <span>{locationAge == null ? "—" : "منذ " + locationAge + " ثانية"}{data.location.accuracy ? " · دقة تقريبية " + Math.round(data.location.accuracy) + "م" : ""}</span>
                  </div>
                  <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${data.location.lat},${data.location.lng}`}>فتح الخريطة</a>
                </div>
              ) : (
                <p className="trackingMuted">سيظهر آخر موقع للسائق هنا أثناء التوصيل عندما يكون متاحاً.</p>
              )}
            </>
          ) : <p className="trackingMuted">لم يتم تعيين سائق بعد.</p>}
        </section>
      </div>

      {data.events?.length ? (
        <section className="trackingCard" aria-label="سجل التوصيل">
          <h2>سجل التوصيل</h2>
          <ol>{data.events.map((event: {id: string; status: string; createdAt: string}) => (
            <li key={event.id}><strong>{labels[event.status] || event.status}</strong>{" — "}
              <time dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString("ar-MA")}</time>
            </li>
          ))}</ol>
        </section>
      ) : null}

      {delivery.status === "delivered" && !data.feedbackSubmitted ? (
        <section className="feedbackCard">
          <div className="sectionTitleIcon"><Star size={21}/><h2>كيف كانت تجربة التوصيل؟</h2></div>
          <form onSubmit={submitFeedback}>
            <div className="starPicker">
              {[1,2,3,4,5].map((value) => (
                <button type="button" key={value} className={value <= rating ? "active" : ""} onClick={() => setRating(value)}><Star/></button>
              ))}
            </div>
            <label className="favoriteToggle"><input type="checkbox" checked={favorite} onChange={(event) => setFavorite(event.target.checked)}/><Heart size={18}/><span>أضف هذا السائق إلى المفضلة</span></label>
            <textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="ملاحظة اختيارية عن تجربتك"/>
            <button className="authSubmit" disabled={sending}>{sending ? "جارٍ الإرسال..." : "إرسال التقييم"}</button>
          </form>
        </section>
      ) : null}

      {delivery.status === "delivered" && data.feedbackSubmitted ? (
        <div className="feedbackThanks"><CheckCircle2/>شكراً، تم تسجيل تقييمك.</div>
      ) : null}

      {error ? <p className="formError trackingError">{error}</p> : null}
    </main>
  );
}
