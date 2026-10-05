"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bike,
  ChevronDown,
  CircleHelp,
  Home,
  Info,
  Menu,
  PackagePlus,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import AuthNav from "@/components/AuthNav";

type Lang = "ar" | "fr" | "en";

const labels = {
  ar: {
    home: "الرئيسية",
    delivery: "طلب توصيل",
    account: "حسابي",
    rider: "السائقون",
    more: "المزيد",
    about: "من نحن",
    help: "المساعدة",
    privacy: "الخصوصية",
    menu: "القائمة",
  },
  fr: {
    home: "Accueil",
    delivery: "Livraison",
    account: "Mon compte",
    rider: "Livreurs",
    more: "Plus",
    about: "À propos",
    help: "Aide",
    privacy: "Confidentialité",
    menu: "Menu",
  },
  en: {
    home: "Home",
    delivery: "New delivery",
    account: "My account",
    rider: "Riders",
    more: "More",
    about: "About",
    help: "Help",
    privacy: "Privacy",
    menu: "Menu",
  },
} as const;

export default function SiteNav({
  lang,
  onLanguageChange,
}: {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const t = labels[lang];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setMoreOpen(false);
  }

  return (
    <>
      <header className="siteNavShell" dir={lang === "ar" ? "rtl" : "ltr"}>
        <nav className="siteNav">
          <Link href="/" className="siteNavBrand" onClick={closeMobile}>
            <BrandMark />
          </Link>

          <div className="desktopNavLinks">
            <Link href="/" className="topNavLink"><Home size={16}/>{t.home}</Link>
            <Link href="/#request" className="topNavLink"><PackagePlus size={16}/>{t.delivery}</Link>
            <Link href="/account" className="topNavLink"><UserRound size={16}/>{t.account}</Link>
            <Link href="/rider" className="topNavLink"><Bike size={16}/>{t.rider}</Link>

            <div className="navDropdown" ref={moreRef}>
              <button
                type="button"
                className={"topNavLink dropdownTrigger " + (moreOpen ? "open" : "")}
                onClick={() => setMoreOpen((value) => !value)}
                aria-expanded={moreOpen}
              >
                {t.more}<ChevronDown size={15}/>
              </button>

              {moreOpen ? (
                <div className="navDropdownMenu">
                  <Link href="/about" onClick={() => setMoreOpen(false)}><Info size={16}/>{t.about}</Link>
                  <Link href="/contact" onClick={() => setMoreOpen(false)}><CircleHelp size={16}/>{t.help}</Link>
                  <Link href="/privacy" onClick={() => setMoreOpen(false)}><ShieldCheck size={16}/>{t.privacy}</Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="siteNavActions">
            <div className="compactLangSwitcher" aria-label="Language selector">
              {(["ar","fr","en"] as Lang[]).map((code) => (
                <button
                  type="button"
                  key={code}
                  className={lang === code ? "active" : ""}
                  onClick={() => onLanguageChange(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="desktopAuth">
              <AuthNav lang={lang} />
            </div>

            <button
              type="button"
              className="mobileMenuButton"
              onClick={() => setMobileOpen(true)}
              aria-label={t.menu}
            >
              <Menu size={22}/>
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen ? (
        <div className="mobileNavOverlay" onClick={closeMobile}>
          <aside
            className="mobileNavDrawer"
            onClick={(event) => event.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="mobileNavHead">
              <BrandMark />
              <button type="button" onClick={closeMobile} aria-label="Close menu">
                <X size={22}/>
              </button>
            </div>

            <div className="mobileNavLinks">
              <Link href="/" onClick={closeMobile}><Home/><span>{t.home}</span></Link>
              <Link href="/#request" onClick={closeMobile}><PackagePlus/><span>{t.delivery}</span></Link>
              <Link href="/account" onClick={closeMobile}><UserRound/><span>{t.account}</span></Link>
              <Link href="/rider" onClick={closeMobile}><Bike/><span>{t.rider}</span></Link>
              <Link href="/about" onClick={closeMobile}><Info/><span>{t.about}</span></Link>
              <Link href="/contact" onClick={closeMobile}><CircleHelp/><span>{t.help}</span></Link>
              <Link href="/privacy" onClick={closeMobile}><ShieldCheck/><span>{t.privacy}</span></Link>
            </div>

            <div className="mobileNavBottom">
              <div className="mobileLanguageTitle">
                {lang === "ar" ? "اللغة" : lang === "fr" ? "Langue" : "Language"}
              </div>
              <div className="mobileLanguageGrid">
                <button className={lang === "ar" ? "active" : ""} onClick={() => onLanguageChange("ar")}>العربية</button>
                <button className={lang === "fr" ? "active" : ""} onClick={() => onLanguageChange("fr")}>Français</button>
                <button className={lang === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>English</button>
              </div>
              <div className="mobileAuthWrap"><AuthNav lang={lang} /></div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
