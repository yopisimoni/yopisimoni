"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
  const [passcode, setPasscode] = useState("");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"active" | "all" | "completed">("active");

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
      const response = await fetch("/api/admin/deliveries", {
        headers: { "x-admin-passcode": code },
        cache: "no-store",
      });

      const json = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error("رمز الإدارة غير صحيح");
        throw new Error(json.detail || "تعذر تحميل لوحة التوصيلات");
      }

      setDeliveries(json.deliveries || []);
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

  async function patch(body: Record<string, unknown>) {
    const response = await fetch("/api/admin/deliveries", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-passcode": passcode,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.detail || json.error || "تعذر تحديث الطلب");
    }
    return json;
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
        <div className="adminLogin">
          <span className="status">Khenifra Delivery Admin</span>
          <h1>لوحة التوصيلات</h1>
          <p>أدخل رمز الإدارة لعرض الطلبات وتعيين السائقين.</p>
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
          <Link href="/admin" className="textLink">إدارة السائقين</Link>
        </div>
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
          <Link className="adminLinkButton" href="/admin">السائقون</Link>
          <button onClick={() => void load()}>تحديث</button>
        </div>
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
                <span>{categoryLabel[delivery.category] || delivery.category}</span>
              </div>

              <div className="deliveryRoute">
                <div>
                  <small>الاستلام</small>
                  <strong>{delivery.pickupAddress}</strong>
                  <a href={"tel:" + delivery.senderPhone}>{delivery.senderPhone}</a>
                </div>
                <div className="routeArrow">←</div>
                <div>
                  <small>التسليم</small>
                  <strong>{delivery.dropoffAddress}</strong>
                  <a href={"tel:" + delivery.recipientPhone}>{delivery.recipientPhone}</a>
                </div>
              </div>

              {delivery.notes ? <p className="deliveryNotes">{delivery.notes}</p> : null}

              <div className="dispatchControls">
                <label>
                  <span>السائق</span>
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
                  <span>الحالة</span>
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
                  <span>السعر المقترح (درهم)</span>
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
