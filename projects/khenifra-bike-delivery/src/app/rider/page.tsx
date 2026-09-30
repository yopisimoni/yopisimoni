"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Bike, CheckCircle2, ChevronLeft, CircleUserRound, Languages, Phone, Send, ShieldCheck } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { applyAsRider } from "@/lib/appwrite/riders";

type Lang = "ar" | "fr" | "en";
const copy = {
  ar: { title:"انضم كسائق توصيل", intro:"املأ المعلومات التالية. سنراجع طلبك قبل تفعيل حساب السائق.", fullName:"الاسم الكامل", phone:"رقم الهاتف", vehicle:"وسيلة التوصيل", bike:"دراجة هوائية", motorbike:"دراجة نارية", submit:"إرسال طلب الانضمام", sending:"جارٍ الإرسال...", success:"تم استلام طلبك", successText:"طلبك الآن قيد المراجعة. سنتواصل معك بعد الموافقة.", back:"العودة للرئيسية", error:"تعذر إرسال الطلب. حاول مرة أخرى.", reviewed:"مراجعة يدوية", local:"عمل محلي مرن", protected:"بياناتك محمية" },
  fr: { title:"Devenir livreur", intro:"Remplissez vos informations. Votre demande sera examinée avant l'activation.", fullName:"Nom complet", phone:"Téléphone", vehicle:"Véhicule", bike:"Vélo", motorbike:"Moto", submit:"Envoyer la candidature", sending:"Envoi...", success:"Candidature reçue", successText:"Votre demande est en attente de validation. Nous vous contacterons après approbation.", back:"Retour à l'accueil", error:"Impossible d'envoyer la candidature. Réessayez.", reviewed:"Validation manuelle", local:"Travail local flexible", protected:"Données protégées" },
  en: { title:"Become a delivery rider", intro:"Complete your details. We will review the application before activating rider access.", fullName:"Full name", phone:"Phone number", vehicle:"Delivery vehicle", bike:"Bicycle", motorbike:"Motorbike", submit:"Submit rider application", sending:"Submitting...", success:"Application received", successText:"Your application is pending review. We will contact you after approval.", back:"Back to home", error:"Could not submit the application. Please try again.", reviewed:"Manual approval", local:"Flexible local work", protected:"Protected data" },
} as const;

export default function RiderApplicationPage() {
  const [lang,setLang]=useState<Lang>("ar");
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(false);
  const [error,setError]=useState("");
  const t=copy[lang];

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setSubmitting(true); setError("");
    const form=new FormData(event.currentTarget);
    try{
      await applyAsRider({
        fullName:String(form.get("fullName")||""),
        phone:String(form.get("phone")||""),
        preferredLanguage:lang,
        vehicleType:String(form.get("vehicleType")||"bike") as "bike"|"motorbike",
      });
      setDone(true);
    }catch(err){console.error(err);setError(t.error)}finally{setSubmitting(false)}
  }

  return (
    <main dir={lang==="ar"?"rtl":"ltr"} lang={lang} className="riderApplicationShell">
      <nav className="nav">
        <Link href="/" className="brandLink"><BrandMark/></Link>
        <div className="langSwitcher" aria-label="Language selector">
          <button className={lang==="ar"?"active":""} onClick={()=>setLang("ar")}>العربية</button>
          <button className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>Français</button>
          <button className={lang==="en"?"active":""} onClick={()=>setLang("en")}>English</button>
        </div>
      </nav>

      <section className="riderApplyPage riderApplyFresh">
        <div className="riderBenefits">
          <div className="bigRiderOrb"><Bike size={54}/></div>
          <h2>{t.title}</h2>
          <div className="benefitList">
            <span><ShieldCheck size={20}/>{t.reviewed}</span>
            <span><Bike size={20}/>{t.local}</span>
            <span><CheckCircle2 size={20}/>{t.protected}</span>
          </div>
        </div>

        <div className="requestCard riderApplyCard elevatedCard">
          {done ? (
            <div className="confirmation">
              <div className="successOrb"><CheckCircle2 size={40}/></div>
              <span className="status">{t.success}</span>
              <h1>{t.success}</h1>
              <p>{t.successText}</p>
              <div className="successActions"><Link className="button primary iconButton" href="/rider/dashboard"><Bike size={18}/>لوحة السائق</Link><Link className="button secondary iconButton" href="/"><ChevronLeft size={18}/>{t.back}</Link></div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="cardTitleRow"><span className="status">Khenifra Delivery</span><Bike size={22}/></div>
              <h1>{t.title}</h1><p>{t.intro}</p>
              <label><CircleUserRound size={16}/>{t.fullName}</label>
              <input name="fullName" required minLength={3}/>
              <label><Phone size={16}/>{t.phone}</label>
              <input name="phone" type="tel" required placeholder="06XXXXXXXX"/>
              <label><Languages size={16}/>{t.vehicle}</label>
              <select name="vehicleType" defaultValue="bike" required>
                <option value="bike">{t.bike}</option>
                <option value="motorbike">{t.motorbike}</option>
              </select>
              <button type="submit" disabled={submitting} className="submitWithIcon"><Send size={18}/>{submitting?t.sending:t.submit}</button>
              {error?<p className="formError">{error}</p>:null}
              <Link className="textLink" href="/">{t.back}</Link>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
