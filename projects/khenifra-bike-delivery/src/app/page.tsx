"use client";

import { FormEvent, useState } from "react";
import {
  Bike,
  CheckCircle2,
  FileText,
  MapPin,
  Navigation,
  Package,
  Phone,
  ReceiptText,
  Send,
  ShoppingBag,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import AuthNav from "@/components/AuthNav";
import { createDelivery } from "@/lib/appwrite/deliveries";

type Lang = "ar" | "fr" | "en";

const copy = {
  ar: {
    brand: "توصيل خنيفرة", eyebrow: "توصيل محلي · خنيفرة",
    title: "نوصّلها لك داخل المدينة.",
    lead: "اطلب درّاجاً محلياً لتوصيل الطعام، المشتريات، طلبات المتاجر، الوثائق والطرود الصغيرة.",
    request: "اطلب توصيلاً", rider: "انضم كسائق توصيل", requestTag: "طلب تجريبي",
    where: "إلى أين تريد التوصيل؟", pickup: "مكان الاستلام",
    pickupPlaceholder: "متجر، مطعم أو عنوان", dropoff: "مكان التسليم",
    dropoffPlaceholder: "عنوان التسليم", carrying: "ماذا سننقل؟", choose: "اختر الفئة",
    food: "طلب طعام", groceries: "مشتريات / طلب متجر", documents: "وثائق", parcel: "طرد صغير",
    senderPhone: "هاتف المرسل", recipientPhone: "هاتف المستلم", phonePlaceholder: "06XXXXXXXX",
    notes: "ملاحظات", notesPlaceholder: "معلومات تساعد السائق في الاستلام أو التسليم",
    estimate: "إنشاء طلب تجريبي", cash: "الدفع نقداً في النسخة الأولى. سيظهر السعر النهائي قبل التأكيد.",
    network: "شبكة توصيل واحدة", useful: "مفيدة من اليوم الأول",
    services: [
      ["استلام من المطاعم", "نستلم طلبك من مطعم محلي ونوصله إلى بابك."],
      ["المتاجر والمشتريات", "أرسل درّاجاً لاستلام طلبك من متجر محلي."],
      ["الوثائق", "توصيل سريع من نقطة إلى نقطة للوثائق والأوراق."],
      ["الطرود الصغيرة", "أرسل طرداً صغيراً إلى أي شخص داخل خنيفرة."],
    ],
    forRiders: "للدراجين المحليين", riderTitle: "وصّل الطلبات عندما تكون متاحاً.",
    riderText: "استقبل الطلبات القريبة، اقبل المهمة، أكد الاستلام وأكمل التوصيل من هاتفك.",
    join: "انضم إلى التجربة", created: "تم إنشاء الطلب التجريبي", order: "رقم الطلب",
    status: "الحالة", statusValue: "بانتظار تعيين سائق", reset: "طلب جديد",
    fast: "داخل خنيفرة", cashShort: "دفع نقدي", tracked: "حالة واضحة",
  },
  fr: {
    brand: "Khenifra Livraison", eyebrow: "LIVRAISON LOCALE · KHENIFRA",
    title: "On livre partout dans la ville.",
    lead: "Demandez un livreur local pour les repas, courses, commandes de magasins, documents et petits colis.",
    request: "Demander une livraison", rider: "Devenir livreur", requestTag: "DEMANDE MVP",
    where: "Où devons-nous livrer ?", pickup: "Ramassage", pickupPlaceholder: "Magasin, restaurant ou adresse",
    dropoff: "Livraison", dropoffPlaceholder: "Adresse de livraison", carrying: "Que transportons-nous ?",
    choose: "Choisir une catégorie", food: "Commande de repas", groceries: "Courses / commande magasin",
    documents: "Documents", parcel: "Petit colis", senderPhone: "Téléphone expéditeur",
    recipientPhone: "Téléphone destinataire", phonePlaceholder: "06XXXXXXXX", notes: "Notes",
    notesPlaceholder: "Informations utiles pour le ramassage ou la livraison",
    estimate: "Créer une demande test", cash: "Paiement en espèces pour le pilote. Le prix final sera affiché avant confirmation.",
    network: "UN SEUL RÉSEAU DE LIVREURS", useful: "Utile dès le premier jour",
    services: [
      ["Ramassage restaurant", "Nous récupérons votre commande dans un restaurant local et la livrons chez vous."],
      ["Courses & magasins", "Envoyez un livreur récupérer une commande dans un commerce local."],
      ["Documents", "Livraison rapide de documents d’un point à un autre."],
      ["Petits colis", "Envoyez un petit colis à quelqu’un dans Khenifra."],
    ],
    forRiders: "POUR LES LIVREURS LOCAUX", riderTitle: "Livrez quand vous êtes disponible.",
    riderText: "Recevez les demandes proches, acceptez les missions, confirmez le ramassage et terminez les livraisons depuis votre téléphone.",
    join: "Rejoindre le pilote", created: "Demande test créée", order: "Commande",
    status: "Statut", statusValue: "En attente d’un livreur", reset: "Nouvelle demande",
    fast: "Dans Khenifra", cashShort: "Paiement cash", tracked: "Statut clair",
  },
  en: {
    brand: "Khenifra Delivery", eyebrow: "LOCAL DELIVERY · KHENIFRA", title: "Send it across the city.",
    lead: "Request a local rider for food, groceries, shop orders, documents and small parcels.",
    request: "Request delivery", rider: "Become a rider", requestTag: "MVP REQUEST",
    where: "Where should we deliver?", pickup: "Pickup", pickupPlaceholder: "Shop, restaurant or address",
    dropoff: "Drop-off", dropoffPlaceholder: "Delivery address", carrying: "What are we carrying?",
    choose: "Select a category", food: "Food order", groceries: "Groceries / shop order",
    documents: "Documents", parcel: "Small parcel", senderPhone: "Sender phone",
    recipientPhone: "Recipient phone", phonePlaceholder: "06XXXXXXXX", notes: "Notes",
    notesPlaceholder: "Anything the rider should know for pickup or drop-off",
    estimate: "Create test request", cash: "Cash-first pilot. Final price shown before confirming.",
    network: "ONE RIDER NETWORK", useful: "Useful from day one",
    services: [
      ["Restaurant pickup", "Pick up an order from a local restaurant and bring it to your door."],
      ["Groceries & shops", "Send a rider to collect an order from a local store."],
      ["Documents", "Fast point-to-point delivery for papers and small documents."],
      ["Small parcels", "Send a small package to someone across Khenifra."],
    ],
    forRiders: "FOR LOCAL RIDERS", riderTitle: "Deliver when you are available.",
    riderText: "Receive nearby requests, accept jobs, confirm pickup and complete deliveries from your phone.",
    join: "Join pilot", created: "Test request created", order: "Order",
    status: "Status", statusValue: "Waiting for rider assignment", reset: "New request",
    fast: "Across Khenifra", cashShort: "Cash payment", tracked: "Clear status",
  },
} as const;

const ServiceIcons = [UtensilsCrossed, Store, FileText, Package];

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [orderCode, setOrderCode] = useState("");
  const [deliveryPin, setDeliveryPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pickupCoords, setPickupCoords] = useState<{lat:number;lng:number} | null>(null);
  const [locating, setLocating] = useState(false);
  const t = copy[lang];
  const rtl = lang === "ar";

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    const form = new FormData(event.currentTarget);

    try {
      const delivery = await createDelivery({
        pickupAddress: String(form.get("pickup") || ""),
        dropoffAddress: String(form.get("dropoff") || ""),
        category: String(form.get("category") || "parcel") as "food" | "groceries" | "documents" | "parcel",
        senderPhone: String(form.get("senderPhone") || ""),
        recipientPhone: String(form.get("recipientPhone") || ""),
        notes: String(form.get("notes") || ""),
        pickupLat: pickupCoords?.lat,
        pickupLng: pickupCoords?.lng,
      });
      setOrderCode(delivery.orderCode);
      setDeliveryPin(delivery.deliveryPin || "");
    } catch (error) {
      console.error(error);
      setSubmitError(
        lang === "ar"
          ? "تعذر إنشاء الطلب الآن. تحقق من اتصال Appwrite وحاول مرة أخرى."
          : lang === "fr"
            ? "Impossible de créer la demande. Vérifiez la connexion Appwrite et réessayez."
            : "Could not create the delivery. Check the Appwrite connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir={rtl ? "rtl" : "ltr"} lang={lang}>
      <nav className="nav">
        <BrandMark />
        <div className="navRight">
          <div className="langSwitcher" aria-label="Language selector">
            <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button>
            <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>Français</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
          </div>
          <AuthNav />
        </div>
      </nav>

      <section className="hero heroFresh">
        <div className="heroCopy">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <div className="trustStrip">
            <span><MapPin size={16} />{t.fast}</span>
            <span><ReceiptText size={16} />{t.cashShort}</span>
            <span><CheckCircle2 size={16} />{t.tracked}</span>
          </div>
          <div className="actions">
            <a className="button primary iconButton" href="#request"><Send size={18}/>{t.request}</a>
            <a className="button secondary iconButton" href="/rider"><Bike size={19}/>{t.rider}</a>
          </div>

          <div className="heroVisual" aria-hidden="true">
            <div className="visualGlow"></div>
            <div className="miniCityCard pickupMini">
              <span className="miniIcon"><Store size={20}/></span>
              <div><small>{t.pickup}</small><strong>Centre Khenifra</strong></div>
            </div>
            <div className="routeTrack"><span></span><span></span><span></span></div>
            <div className="riderBubble"><Bike size={30}/></div>
            <div className="miniCityCard dropMini">
              <span className="miniIcon"><MapPin size={20}/></span>
              <div><small>{t.dropoff}</small><strong>Hay Al Massira</strong></div>
            </div>
            <div className="parcelBubble"><Package size={25}/></div>
          </div>
        </div>

        <div className="requestCard elevatedCard" id="request">
          {orderCode ? (
            <div className="confirmation">
              <div className="successOrb"><CheckCircle2 size={38}/></div>
              <span className="status">{t.created}</span>
              <div className="orderBadge">{orderCode}</div>
              <p><strong>{t.status}:</strong> {t.statusValue}</p>
              {deliveryPin ? (
                <div className="deliveryPinCard">
                  <small>{lang === "ar" ? "رمز تأكيد التسليم" : lang === "fr" ? "Code de livraison" : "Delivery PIN"}</small>
                  <strong>{deliveryPin}</strong>
                  <span>{lang === "ar" ? "أعطِ هذا الرمز للسائق فقط عند استلام طلبك." : lang === "fr" ? "Donnez ce code au livreur uniquement lorsque vous recevez votre commande." : "Give this PIN to the rider only when you receive your order."}</span>
                </div>
              ) : null}
              <button type="button" onClick={() => { setOrderCode(""); setDeliveryPin(""); }}>{t.reset}</button>
            </div>
          ) : (
            <form onSubmit={submitRequest}>
              <div className="cardTitleRow">
                <span className="status">{t.requestTag}</span>
                <Navigation size={22}/>
              </div>
              <h2>{t.where}</h2>
              <div className="labelActionRow"><label><MapPin size={15}/>{t.pickup}</label><button type="button" className="locationMiniButton" onClick={() => {
                if (!navigator.geolocation) return;
                setLocating(true);
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setPickupCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setLocating(false);
                  },
                  () => {
                    setSubmitError(lang === "ar" ? "لم يتم منح إذن الموقع. يمكنك متابعة الطلب بالعنوان فقط." : lang === "fr" ? "Permission de localisation refusée. Vous pouvez continuer avec l'adresse." : "Location permission denied. You can continue with the address.");
                    setLocating(false);
                  },
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                );
              }}><Navigation size={14}/>{pickupCoords ? (lang==="ar"?"تم تحديد الموقع":lang==="fr"?"Position ajoutée":"Location added") : locating ? "..." : (lang==="ar"?"استخدم موقعي":lang==="fr"?"Ma position":"Use my location")}</button></div>
              <input name="pickup" required placeholder={t.pickupPlaceholder} />
              <label><Navigation size={15}/>{t.dropoff}</label>
              <input name="dropoff" required placeholder={t.dropoffPlaceholder} />
              <label><Package size={15}/>{t.carrying}</label>
              <select name="category" defaultValue="" required>
                <option value="" disabled>{t.choose}</option>
                <option value="food">{t.food}</option>
                <option value="groceries">{t.groceries}</option>
                <option value="documents">{t.documents}</option>
                <option value="parcel">{t.parcel}</option>
              </select>
              <div className="twoCols">
                <div><label><Phone size={15}/>{t.senderPhone}</label><input name="senderPhone" type="tel" required placeholder={t.phonePlaceholder} /></div>
                <div><label><Phone size={15}/>{t.recipientPhone}</label><input name="recipientPhone" type="tel" required placeholder={t.phonePlaceholder} /></div>
              </div>
              <label><FileText size={15}/>{t.notes}</label>
              <textarea name="notes" rows={3} placeholder={t.notesPlaceholder} />
              <button type="submit" disabled={submitting} className="submitWithIcon">
                <Send size={18}/>{submitting ? "..." : t.estimate}
              </button>
              {submitError ? <p className="formError">{submitError}</p> : null}
              <small>{t.cash}</small>
            </form>
          )}
        </div>
      </section>

      <section className="services">
        <div className="sectionHead"><span className="eyebrow">{t.network}</span><h2>{t.useful}</h2></div>
        <div className="grid">
          {t.services.map(([title, text], index) => {
            const Icon = ServiceIcons[index];
            return <article key={title} className="serviceCard"><div className="icon"><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><span className="cardArrow">↗</span></article>;
          })}
        </div>
      </section>

      <section className="rider riderFresh" id="riders">
        <div className="riderVisual" aria-hidden="true"><div className="riderVisualCircle"><Bike size={42}/></div><div className="speedLine s1"></div><div className="speedLine s2"></div><div className="speedLine s3"></div></div>
        <div className="riderCopy"><span className="eyebrow">{t.forRiders}</span><h2>{t.riderTitle}</h2><p>{t.riderText}</p></div>
        <a className="button primary iconButton" href="/rider"><Bike size={18}/>{t.join}</a>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand"><BrandMark compact/><strong>{t.brand}</strong><span>© 2026</span></div>
        <nav aria-label="Legal and information">
          <a href="/about">{lang === "ar" ? "من نحن" : lang === "fr" ? "À propos" : "About"}</a>
          <a href="/privacy">{lang === "ar" ? "الخصوصية" : lang === "fr" ? "Confidentialité" : "Privacy"}</a>
          <a href="/terms">{lang === "ar" ? "الشروط" : lang === "fr" ? "Conditions" : "Terms"}</a>
          <a href="/contact">{lang === "ar" ? "اتصل بنا" : "Contact"}</a>
          <a href="/delete-data">{lang === "ar" ? "حذف البيانات" : lang === "fr" ? "Supprimer mes données" : "Delete data"}</a>
        </nav>
      </footer>
    </main>
  );
}
