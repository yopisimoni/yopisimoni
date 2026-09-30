import InfoPage from "@/components/InfoPage";

const content = {
  ar: {
    title: "شروط الاستخدام",
    updated: "آخر تحديث: 30 سبتمبر 2026",
    intro: "باستخدام توصيل خنيفرة، فإنك توافق على استخدام الخدمة بشكل قانوني ومسؤول.",
    sections: [
      { title: "طبيعة الخدمة", paragraphs: ["توصيل خنيفرة منصة محلية لتنظيم طلبات التوصيل داخل خنيفرة وربط العملاء بالسائقين المعتمدين."] },
      { title: "الطلبات والمعلومات", paragraphs: ["يجب تقديم معلومات صحيحة وكافية عن الاستلام والتسليم وأرقام التواصل. يتحمل المستخدم مسؤولية التأكد من أن محتوى الطرد مسموح وقانوني وآمن للنقل."] },
      { title: "المواد غير المقبولة", paragraphs: ["لا يجوز استخدام الخدمة لنقل مواد محظورة قانونياً أو خطرة أو مسروقة أو أي شيء يعرض السائق أو الآخرين للخطر."] },
      { title: "الأسعار والدفع", paragraphs: ["في النسخة التجريبية يكون الدفع نقداً ما لم يتم توضيح غير ذلك. يجب إظهار السعر النهائي أو تأكيده قبل إتمام الطلب متى كانت ميزة التسعير متاحة."] },
      { title: "السائقون", paragraphs: ["يخضع السائقون للمراجعة والموافقة قبل تفعيلهم. يمكن تعليق حساب سائق عند وجود أسباب تشغيلية أو أمنية مشروعة."] },
      { title: "الإلغاء والمشاكل", paragraphs: ["قد يتم إلغاء أو تعليق طلب إذا كانت البيانات غير كافية، أو تعذر الوصول، أو كان التنفيذ غير آمن أو غير قانوني."] },
      { title: "حدود المسؤولية", paragraphs: ["نبذل جهداً معقولاً لتقديم الخدمة بشكل موثوق، لكن قد تتأثر الخدمة بعوامل خارج السيطرة مثل الاتصال أو توفر السائقين أو الظروف الميدانية."] },
      { title: "التغييرات", paragraphs: ["قد نقوم بتحديث هذه الشروط مع تطور الخدمة. سيظهر تاريخ آخر تحديث أعلى الصفحة."] }
    ]
  },
  fr: {
    title: "Conditions d'utilisation",
    updated: "Dernière mise à jour : 30 septembre 2026",
    intro: "En utilisant Khenifra Delivery, vous acceptez d'utiliser le service de manière légale et responsable.",
    sections: [
      { title: "Nature du service", paragraphs: ["Khenifra Delivery est un service local permettant d'organiser des livraisons à Khenifra et de mettre en relation les clients avec des livreurs approuvés."] },
      { title: "Commandes et informations", paragraphs: ["Les utilisateurs doivent fournir des informations exactes et suffisantes. Ils sont responsables du caractère légal et sûr des objets remis à la livraison."] },
      { title: "Objets interdits", paragraphs: ["Le service ne doit pas être utilisé pour transporter des articles illégaux, dangereux, volés ou susceptibles de mettre en danger le livreur ou d'autres personnes."] },
      { title: "Prix et paiement", paragraphs: ["Pendant le pilote, le paiement est en espèces sauf indication contraire. Le prix final doit être présenté ou confirmé avant la finalisation lorsque la tarification est disponible."] },
      { title: "Livreurs", paragraphs: ["Les livreurs sont examinés et approuvés avant activation. Un accès peut être suspendu pour des raisons opérationnelles ou de sécurité légitimes."] },
      { title: "Annulation et incidents", paragraphs: ["Une livraison peut être annulée ou suspendue si les informations sont insuffisantes, si le destinataire est injoignable ou si l'exécution n'est pas sûre ou légale."] },
      { title: "Limitation", paragraphs: ["Nous faisons des efforts raisonnables pour fournir un service fiable, mais la disponibilité peut dépendre de facteurs externes comme la connectivité, la disponibilité des livreurs ou les conditions locales."] },
      { title: "Modifications", paragraphs: ["Ces conditions peuvent être mises à jour à mesure que le service évolue. La date de mise à jour apparaît en haut de la page."] }
    ]
  },
  en: {
    title: "Terms of Use",
    updated: "Last updated: September 30, 2026",
    intro: "By using Khenifra Delivery, you agree to use the service lawfully and responsibly.",
    sections: [
      { title: "Service", paragraphs: ["Khenifra Delivery is a local service for organizing deliveries within Khenifra and connecting customers with approved riders."] },
      { title: "Orders and information", paragraphs: ["Users must provide accurate and sufficient pickup, drop-off, and contact information. Users are responsible for ensuring that items handed over for delivery are lawful and safe to transport."] },
      { title: "Prohibited items", paragraphs: ["The service may not be used to transport illegal, dangerous, stolen, or otherwise unsafe items that could place a rider or another person at risk."] },
      { title: "Pricing and payment", paragraphs: ["During the pilot, payment is cash unless stated otherwise. The final price should be shown or confirmed before completion when pricing functionality is available."] },
      { title: "Riders", paragraphs: ["Riders are reviewed and approved before activation. Rider access may be suspended for legitimate operational or safety reasons."] },
      { title: "Cancellation and incidents", paragraphs: ["A delivery may be cancelled or paused when information is insufficient, a party cannot be reached, or completing the request would be unsafe or unlawful."] },
      { title: "Limitations", paragraphs: ["We use reasonable efforts to provide a reliable service, but availability can be affected by connectivity, rider availability, and local conditions outside our control."] },
      { title: "Changes", paragraphs: ["We may update these terms as the service develops. The latest update date will appear at the top of this page."] }
    ]
  }
} as const;

export default function TermsPage() {
  return <InfoPage content={content} />;
}
