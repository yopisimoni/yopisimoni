"use client";

import Link from "next/link";
import { useState } from "react";

export type InfoLang = "ar" | "fr" | "en";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type Content = {
  title: string;
  updated: string;
  intro?: string;
  sections: Section[];
};

export default function InfoPage({
  content,
}: {
  content: Record<InfoLang, Content>;
}) {
  const [lang, setLang] = useState<InfoLang>("ar");
  const t = content[lang];

  return (
    <main className="infoPage" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <nav className="nav infoNav">
        <Link className="brandLink" href="/">توصيل خنيفرة</Link>
        <div className="langSwitcher" aria-label="Language selector">
          <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button>
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>Français</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
        </div>
      </nav>

      <article className="infoCard">
        <span className="status">Khenifra Delivery</span>
        <h1>{t.title}</h1>
        <p className="infoUpdated">{t.updated}</p>
        {t.intro ? <p className="infoIntro">{t.intro}</p> : null}

        {t.sections.map((section) => (
          <section className="infoSection" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            ) : null}
          </section>
        ))}

        <div className="infoActions">
          <Link className="button secondary" href="/">← {lang === "ar" ? "العودة للرئيسية" : lang === "fr" ? "Retour à l'accueil" : "Back to home"}</Link>
        </div>
      </article>
    </main>
  );
}
