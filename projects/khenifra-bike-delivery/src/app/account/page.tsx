"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bike,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  Package,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { getMyAccountData, signOut } from "@/lib/appwrite/auth";

const labels: Record<string, string> = {
  requested: "طلب جديد",
  assigned: "تم تعيين سائق",
  rider_to_pickup: "السائق في الطريق للاستلام",
  picked_up: "تم الاستلام",
  rider_to_dropoff: "في الطريق إليك",
  delivered: "تم التسليم",
  cancelled: "ملغى",
  failed: "فشل التسليم",
};

export default function AccountPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setData(await getMyAccountData());
      } catch {
        window.location.href = "/signin";
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function logout() {
    try {
      await signOut();
      window.location.href = "/";
    } catch {
      setError("تعذر تسجيل الخروج.");
    }
  }

  if (loading) {
    return <main dir="rtl" className="accountPage"><div className="loadingCard"><UserRound/><span>جارٍ تحميل حسابك...</span></div></main>;
  }

  const user = data?.user;
  const profile = data?.profile;
  const deliveries = data?.deliveries || [];
  const active = deliveries.filter((row: any) => !["delivered", "cancelled", "failed"].includes(row.status));
  const completed = deliveries.filter((row: any) => row.status === "delivered");

  return (
    <main dir="rtl" className="accountPage">
      <nav className="nav accountNav">
        <Link href="/"><BrandMark/></Link>
        <div className="authNav">
          <Link className="authNavPrimary" href="/#request"><Plus size={16}/>طلب جديد</Link>
          <button className="authNavLink authNavButton" onClick={() => void logout()}><LogOut size={16}/>خروج</button>
        </div>
      </nav>

      <section className="accountHero">
        <div className="accountAvatar"><UserRound size={30}/></div>
        <div>
          <span className="status">حساب العميل</span>
          <h1>{profile?.full_name || user?.name || "حسابي"}</h1>
          <div className="accountContact">
            <span><Mail size={15}/>{user?.email || "—"}</span>
            <span><Phone size={15}/>{profile?.phone || "—"}</span>
          </div>
        </div>
      </section>

      {error ? <p className="formError">{error}</p> : null}

      <div className="accountStats">
        <div><Package/><small>كل الطلبات</small><strong>{deliveries.length}</strong></div>
        <div><Clock3/><small>طلبات جارية</small><strong>{active.length}</strong></div>
        <div><CheckCircle2/><small>تم تسليمها</small><strong>{completed.length}</strong></div>
      </div>

      <section className="accountSection">
        <div className="sectionTitleIcon"><Package size={20}/><h2>طلباتي</h2></div>

        {deliveries.length === 0 ? (
          <div className="emptyAdmin visualEmpty"><Package size={28}/><strong>لا توجد طلبات بعد</strong><span>أنشئ أول طلب توصيل من الصفحة الرئيسية.</span></div>
        ) : (
          <div className="accountOrders">
            {deliveries.map((delivery: any) => (
              <article className="accountOrderCard" key={delivery.$id}>
                <div className="accountOrderHead">
                  <strong>{delivery.order_code}</strong>
                  <span className={"deliveryStatus deliveryStatus-" + delivery.status}>{labels[delivery.status] || delivery.status}</span>
                </div>
                <div className="accountRoute">
                  <span><small>الاستلام</small>{delivery.pickup_address}</span>
                  <span><small>التسليم</small>{delivery.dropoff_address}</span>
                </div>
                <div className="accountOrderMeta">
                  <span>{new Date(delivery.requested_at).toLocaleString("ar-MA")}</span>
                  <strong>{typeof delivery.final_price_mad === "number" ? delivery.final_price_mad : typeof delivery.quoted_price_mad === "number" ? delivery.quoted_price_mad : "—"} {typeof delivery.final_price_mad === "number" || typeof delivery.quoted_price_mad === "number" ? "MAD" : ""}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="accountRiderCallout">
        <Bike size={28}/>
        <div><strong>هل تريد العمل معنا كسائق؟</strong><span>استخدم نفس الحساب وقدّم طلب الانضمام.</span></div>
        <Link href="/rider">الانضمام كسائق</Link>
      </section>
    </main>
  );
}
