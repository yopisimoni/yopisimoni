"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Bike, CheckCircle2, Clock3, LayoutDashboard, LogOut, Phone, RefreshCw, UserRoundCheck, UserRoundX } from "lucide-react";
import { account } from "@/lib/appwrite/client";
import { adminFetch } from "@/lib/appwrite/admin-client";

type Rider={id:string;userId:string;status:"pending"|"approved"|"suspended";isOnline:boolean;vehicleType:"bike"|"motorbike";createdAt:string;fullName:string;phone:string;preferredLanguage:string};

export default function AdminRidersPage(){
  const [riders,setRiders]=useState<Rider[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load(){
    setLoading(true); setError("");
    try{
      const response=await adminFetch("/api/admin/riders",{cache:"no-store"});
      if(response.status===401){window.location.href="/admin/login";return}
      if(!response.ok)throw new Error("تعذر تحميل طلبات السائقين");
      const json=await response.json();
      setRiders(json.riders||[]);
    }catch(err){setError(err instanceof Error?err.message:"حدث خطأ")}finally{setLoading(false)}
  }

  useEffect(()=>{void load()},[]);

  async function changeStatus(rowId:string,status:Rider["status"]){
    const response=await adminFetch("/api/admin/riders",{method:"PATCH",body:JSON.stringify({rowId,status})});
    if(response.status===401){window.location.href="/admin/login";return}
    if(!response.ok){setError("تعذر تحديث حالة السائق");return}
    setRiders(current=>current.map(rider=>rider.id===rowId?{...rider,status}:rider));
  }

  async function logout(){
    try{await account.deleteSession({sessionId:"current"})}catch{}
    window.location.href="/admin/login";
  }

  const pending=riders.filter(r=>r.status==="pending"), approved=riders.filter(r=>r.status==="approved"), suspended=riders.filter(r=>r.status==="suspended"), reviewed=riders.filter(r=>r.status!=="pending");

  if(loading)return <main dir="rtl" className="adminPage"><div className="loadingCard"><Bike/><span>جارٍ تحميل لوحة الإدارة...</span></div></main>;

  return <main dir="rtl" className="adminPage">
    <div className="adminHeader"><div><span className="status">Khenifra Delivery Admin</span><h1>طلبات السائقين</h1><p>مراجعة السائقين واعتمادهم قبل بدء التوصيل.</p></div><div className="adminHeaderActions"><Link className="adminLinkButton iconButton" href="/admin/analytics"><BarChart3 size={17}/>التحليلات</Link><Link className="adminLinkButton iconButton" href="/admin/deliveries"><LayoutDashboard size={17}/>لوحة التوصيلات</Link><button className="iconButton" onClick={()=>void load()}><RefreshCw size={16}/>تحديث</button><button className="secondaryAdminButton iconButton" onClick={()=>void logout()}><LogOut size={16}/>خروج</button></div></div>
    <div className="kpiGrid">
      <div className="kpiCard"><span className="kpiIcon amber"><Clock3/></span><div><small>بانتظار المراجعة</small><strong>{pending.length}</strong></div></div>
      <div className="kpiCard"><span className="kpiIcon green"><UserRoundCheck/></span><div><small>سائقون معتمدون</small><strong>{approved.length}</strong></div></div>
      <div className="kpiCard"><span className="kpiIcon red"><UserRoundX/></span><div><small>موقوفون</small><strong>{suspended.length}</strong></div></div>
      <div className="kpiCard"><span className="kpiIcon blue"><Bike/></span><div><small>الإجمالي</small><strong>{riders.length}</strong></div></div>
    </div>
    {error?<p className="formError">{error}</p>:null}
    <section className="adminSection"><div className="sectionTitleIcon"><Clock3 size={20}/><h2>بانتظار الموافقة</h2></div>{pending.length===0?<div className="emptyAdmin visualEmpty"><CheckCircle2 size={32}/><strong>كل شيء مرتب</strong><span>لا توجد طلبات معلقة.</span></div>:<div className="adminGrid">{pending.map(rider=><article className="riderAdminCard" key={rider.id}><div className="riderAvatar"><Bike size={22}/></div><div className="riderAdminTop"><strong>{rider.fullName||"بدون اسم"}</strong><span className="pendingPill">قيد المراجعة</span></div><p><Phone size={15}/><b>الهاتف:</b> {rider.phone||"—"}</p><p><Bike size={15}/><b>المركبة:</b> {rider.vehicleType==="motorbike"?"دراجة نارية":"دراجة هوائية"}</p><p><b>اللغة:</b> {rider.preferredLanguage}</p><div className="adminCardActions"><button className="iconButton" onClick={()=>void changeStatus(rider.id,"approved")}><UserRoundCheck size={16}/>موافقة</button><button className="dangerButton iconButton" onClick={()=>void changeStatus(rider.id,"suspended")}><UserRoundX size={16}/>تعليق</button></div></article>)}</div>}</section>
    <section className="adminSection"><div className="sectionTitleIcon"><CheckCircle2 size={20}/><h2>تمت المراجعة</h2></div><div className="adminGrid">{reviewed.map(rider=><article className="riderAdminCard" key={rider.id}><div className="riderAvatar"><Bike size={22}/></div><div className="riderAdminTop"><strong>{rider.fullName||"بدون اسم"}</strong><span className={rider.status==="approved"?"approvedPill":"suspendedPill"}>{rider.status==="approved"?"مقبول":"معلّق"}</span></div><p><Phone size={15}/>{rider.phone||"—"}</p><p><Bike size={15}/>{rider.vehicleType==="motorbike"?"دراجة نارية":"دراجة هوائية"}</p><div className="adminCardActions">{rider.status==="approved"?<button className="dangerButton iconButton" onClick={()=>void changeStatus(rider.id,"suspended")}><UserRoundX size={16}/>تعليق</button>:<button className="iconButton" onClick={()=>void changeStatus(rider.id,"approved")}><UserRoundCheck size={16}/>إعادة التفعيل</button>}</div></article>)}</div></section>
    <Link href="/" className="textLink">← العودة للموقع</Link>
  </main>
}
