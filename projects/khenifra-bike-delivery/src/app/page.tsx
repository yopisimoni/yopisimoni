"use client";

import { FormEvent, useState } from "react";

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
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [orderCode, setOrderCode] = useState("");
  const t = copy[lang];
  const rtl = lang === "ar";

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = "KHF-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setOrderCode(code);
  }

  return (
    <main dir={rtl ? "rtl" : "ltr"} lang={lang}>
      <nav className="nav">
        <strong>{t.brand}</strong>
        <div className="langSwitcher" aria-label="Language selector">
          <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button>
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>Français</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <div className="actions">
            <a className="button primary" href="#request">{t.request}</a>
            <a className="button secondary" href="#riders">{t.rider}</a>
          </div>
        </div>

        <div className="requestCard" id="request">
          {orderCode ? (
            <div className="confirmation">
              <span className="status">{t.created}</span>
              <div className="orderBadge">{orderCode}</div>
              <p><strong>{t.status}:</strong> {t.statusValue}</p>
              <button type="button" onClick={() => setOrderCode("")}>{t.reset}</button>
            </div>
          ) : (
            <form onSubmit={submitRequest}>
              <span className="status">{t.requestTag}</span>
              <h2>{t.where}</h2>
              <label>{t.pickup}</label>
              <input name="pickup" required placeholder={t.pickupPlaceholder} />
              <label>{t.dropoff}</label>
              <input name="dropoff" required placeholder={t.dropoffPlaceholder} />
              <label>{t.carrying}</label>
              <select name="category" defaultValue="" required>
                <option value="" disabled>{t.choose}</option>
                <option value="food">{t.food}</option>
                <option value="groceries">{t.groceries}</option>
                <option value="documents">{t.documents}</option>
                <option value="parcel">{t.parcel}</option>
              </select>
              <div className="twoCols">
                <div>
                  <label>{t.senderPhone}</label>
                  <input name="senderPhone" type="tel" required placeholder={t.phonePlaceholder} />
                </div>
                <div>
                  <label>{t.recipientPhone}</label>
                  <input name="recipientPhone" type="tel" required placeholder={t.phonePlaceholder} />
                </div>
              </div>
              <label>{t.notes}</label>
              <textarea name="notes" rows={3} placeholder={t.notesPlaceholder} />
              <button type="submit">{t.estimate}</button>
              <small>{t.cash}</small>
            </form>
          )}
        </div>
      </section>

      <section className="services">
        <div className="sectionHead"><span className="eyebrow">{t.network}</span><h2>{t.useful}</h2></div>
        <div className="grid">
          {t.services.map(([title, text]) => (
            <article key={title}><div className="icon">↗</div><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="rider" id="riders">
        <div><span className="eyebrow">{t.forRiders}</span><h2>{t.riderTitle}</h2><p>{t.riderText}</p></div>
        <a className="button primary" href="mailto:simohamed.amara@gmail.com?subject=Khenifra%20Delivery%20Rider">{t.join}</a>
      </section>
    </main>
  );
}
