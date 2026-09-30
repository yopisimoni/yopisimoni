"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bike, CheckCircle2, CircleDollarSign, Clock3, LayoutDashboard, MapPin, Navigation, Package, Phone, RefreshCw, Route, Truck, XCircle } from "lucide-react";
import { adminFetch } from "@/lib/appwrite/admin-client";

type DeliveryStatus =
  | "requested"
  | "assigned"
  | "rider_to_pickup"
  | "picked_up"
  | "rider_to_dropoff"
  | "delivered"
  | "cancelled"
  | "failed";

type Delivery = {
  id: string;
  orderCode: string;
  customerId: string;
  riderId: string | null;
  riderName: string;
  category: string;
  status: DeliveryStatus;
  pickupAddress: string;
  dropoffAddress: string;
  senderPhone: string;
  recipientPhone: string;
  notes: string;
  quotedPriceMad: number | null;
  requestedAt: string;
  pickupLat: number | null;
  pickupLng: number | null;
};

type Rider = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  vehicleType: "bike" | "motorbike";
  isOnline: boolean;
};

const statusLabel: Record<DeliveryStatus, string> = {
  requested: "طلب جديد",
  assigned: "تم تعيين سائق",
  rider_to_pickup: "السائق في طريقه للاستلام",
  picked_up: "تم الاستلام",
  rider_to_dropoff: "في طريقه للتسليم",
  delivered: "تم التسليم",
  cancelled: "ملغى",
  failed: "فشل التسليم",
};

const categoryLabel: Record<string, string> = {
  food: "طعام",
  groceries: "مشتريات",
  documents: "وثائق",
  parcel: "طرد صغير",
};

export default function AdminDispatchPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"active" | "all" | "completed">("active");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await adminFetch("/api/admin/deliveries", { cache: "no-store" });
      const json = await response.json();
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error(json.detail || "تعذر تحميل لوحة التوصيلات");
      setDeliveries(json.deliveries || []);
      setRiders(json.riders || []);
      setReady(true);
    } catch (err) {
      setReady(false);
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function patch(body: Record<string, unknown>) {
    const response = await adminFetch("/api/admin/deliveries", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.detail || json.error || "تعذر تحديث الطلب");
    }
    return json;
  }

  async function assignNearest(deliveryId: string) {
    setError("");
    try {
      await patch({ action: "assign_nearest", deliveryId });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر العثور على سائق قريب");
    }
  }

  async function assign(deliveryId: string, riderUserId: string) {
    if (!riderUserId) return;
    setError("");
    try {
      await patch({ action: "assign", deliveryId, riderUserId });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تعيين السائق");
    }
  }

  async function updateStatus(deliveryId: string, status: DeliveryStatus) {
    setError("");
    try {
      await patch({ action: "status", deliveryId, status });
      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId ? { ...delivery, status } : delivery
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحديث الحالة");
    }
  }

  async function savePrice(deliveryId: string, value: string) {
    if (!value) return;
    setError("");
    try {
      const json = await patch({
        action: "price",
        deliveryId,
        quotedPriceMad: Number(value),
      });
      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, quotedPriceMad: json.delivery.quotedPriceMad }
            : delivery
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ السعر");
    }
  }

  const visibleDeliveries = useMemo(() => {
    if (filter === "all") return deliveries;
    if (filter === "completed") {
      return deliveries.filter((delivery) =>
        ["delivered", "cancelled", "failed"].includes(delivery.status)
      );
    }
    return deliveries.filter(
      (delivery) =>
        !["delivered", "cancelled", "failed"].includes(delivery.status)
    );
  }, [deliveries, filter]);

  const activeCount = deliveries.filter(
    (delivery) => !["delivered", "cancelled", "failed"].includes(delivery.status)
  ).length;

  if (!ready) {
    return (
      <main dir="rtl" className="adminPage">
        <div className="loadingCard"><LayoutDashboard/><span>{loading ? "جارٍ تحميل لوحة التوصيلات..." : error || "يجب تسجيل دخول الإدارة."}</span></div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="adminPage">
      <div className="adminHeader dispatchHeader">
        <div>
          <span className="status">Khenifra Delivery Dispatch</span>
          <h1>لوحة التوصيلات</h1>
          <p>
            {activeCount} طلب نشط · {riders.length} سائق معتمد · {deliveries.length} طلب إجمالي
          </p>
        </div>
        <div className="adminHeaderActions">
          <Link className="adminLinkButton iconButton" href="/admin/analytics"><BarChart3 size={17}/>التحليلات</Link>
          <Link className="adminLinkButton iconButton" href="/admin"><Bike size={17}/>السائقون</Link>
          <button className="iconButton" onClick={() => void load()}><RefreshCw size={16}/>تحديث</button>
        </div>
      </div>

      <div className="kpiGrid dispatchKpis">
        <div className="kpiCard"><span className="kpiIcon amber"><Clock3/></span><div><small>طلبات نشطة</small><strong>{activeCount}</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon green"><Bike/></span><div><small>سائقون معتمدون</small><strong>{riders.length}</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon blue"><Package/></span><div><small>كل الطلبات</small><strong>{deliveries.length}</strong></div></div>
        <div className="kpiCard"><span className="kpiIcon red"><XCircle/></span><div><small>مغلقة / فاشلة</small><strong>{deliveries.length-activeCount}</strong></div></div>
      </div>

      <div className="dispatchFilters">
        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>النشطة</button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>المكتملة</button>
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>الكل</button>
      </div>

      {error ? <p className="formError">{error}</p> : null}

      {visibleDeliveries.length === 0 ? (
        <div className="emptyAdmin">لا توجد طلبات في هذا القسم.</div>
      ) : (
        <div className="dispatchList">
          {visibleDeliveries.map((delivery) => (
            <article className="deliveryAdminCard" key={delivery.id}>
              <div className="deliveryAdminHead">
                <div>
                  <strong className="deliveryCode">{delivery.orderCode}</strong>
                  <span className={"deliveryStatus deliveryStatus-" + delivery.status}>
                    {statusLabel[delivery.status]}
                  </span>
                </div>
                <span className="categoryChip"><Package size={14}/>{categoryLabel[delivery.category] || delivery.category}</span>
              </div>

              <div className="deliveryRoute">
                <div>
                  <small><MapPin size={14}/>الاستلام</small>
                  <strong>{delivery.pickupAddress}</strong>
                  <a href={"tel:" + delivery.senderPhone}><Phone size={14}/>{delivery.senderPhone}</a>
                </div>
                <div className="routeArrow"><Route size={22}/></div>
                <div>
                  <small><Navigation size={14}/>التسليم</small>
                  <strong>{delivery.dropoffAddress}</strong>
                  <a href={"tel:" + delivery.recipientPhone}><Phone size={14}/>{delivery.recipientPhone}</a>
                </div>
              </div>

              {delivery.notes ? <p className="deliveryNotes">{delivery.notes}</p> : null}

              <div className="nearestAssignRow">
                <button className="nearestAssignButton" disabled={delivery.pickupLat == null || delivery.pickupLng == null} onClick={() => void assignNearest(delivery.id)}>
                  <Navigation size={17}/> تعيين أقرب سائق متاح
                </button>
                {delivery.pickupLat == null ? <small>أضف موقع الاستلام من واجهة العميل لتفعيل الاختيار التلقائي.</small> : <small>سيتم اختيار أقرب سائق معتمد وحالته متاح.</small>}
              </div>

              <div className="dispatchControls">
                <label>
                  <span><Bike size={14}/>السائق</span>
                  <select
                    value={delivery.riderId || ""}
                    onChange={(event) => void assign(delivery.id, event.target.value)}
                  >
                    <option value="">اختر سائقاً معتمداً</option>
                    {riders.map((rider) => (
                      <option value={rider.userId} key={rider.userId}>
                        {rider.fullName || rider.phone} · {rider.vehicleType === "motorbike" ? "دراجة نارية" : "دراجة هوائية"}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span><Truck size={14}/>الحالة</span>
                  <select
                    value={delivery.status}
                    onChange={(event) =>
                      void updateStatus(delivery.id, event.target.value as DeliveryStatus)
                    }
                  >
                    {Object.entries(statusLabel).map(([value, label]) => (
                      <option value={value} key={value}>{label}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span><CircleDollarSign size={14}/>السعر المقترح (درهم)</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={delivery.quotedPriceMad ?? ""}
                    onBlur={(event) => void savePrice(delivery.id, event.target.value)}
                    placeholder="مثال: 15"
                  />
                </label>
              </div>

              <div className="deliveryMeta">
                <span>السائق: {delivery.riderName || "لم يُعيّن بعد"}</span>
                <span>الطلب: {new Date(delivery.requestedAt).toLocaleString("ar-MA")}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
