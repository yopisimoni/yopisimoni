import InfoPage from "@/components/InfoPage";

const content = {
  ar: {
    title: "اتصل بنا",
    updated: "دعم توصيل خنيفرة",
    intro: "يمكنك التواصل معنا بخصوص الطلبات، السائقين، الخصوصية أو أي مشكلة تقنية.",
    sections: [
      { title: "البريد الإلكتروني", paragraphs: ["simohamed.amara@gmail.com"] },
      { title: "ما الذي ترسله لنا؟", bullets: [
        "رقم الطلب KHF- إذا كان سؤالك عن توصيل.",
        "رقم الهاتف المستخدم في الطلب إن كان ذلك ضرورياً للتحقق.",
        "وصف مختصر للمشكلة أو الطلب.",
        "لا ترسل كلمات مرور أو مفاتيح API أو رموز إدارة."
      ]},
      { title: "الخصوصية وحذف البيانات", paragraphs: ["لطلب حذف أو تصحيح بيانات، اذكر بوضوح أن الرسالة تتعلق بطلب خصوصية أو حذف بيانات."] }
    ]
  },
  fr: {
    title: "Contact",
    updated: "Assistance Khenifra Delivery",
    intro: "Contactez-nous pour les livraisons, les livreurs, la confidentialité ou un problème technique.",
    sections: [
      { title: "E-mail", paragraphs: ["simohamed.amara@gmail.com"] },
      { title: "Informations utiles", bullets: [
        "Le numéro de commande KHF- pour une demande concernant une livraison.",
        "Le numéro de téléphone utilisé pour la commande uniquement si nécessaire à la vérification.",
        "Une brève description du problème.",
        "N'envoyez jamais de mot de passe, clé API ou code administrateur."
      ]},
      { title: "Confidentialité et suppression", paragraphs: ["Pour demander une suppression ou correction de données, indiquez clairement qu'il s'agit d'une demande de confidentialité ou de suppression."] }
    ]
  },
  en: {
    title: "Contact Us",
    updated: "Khenifra Delivery Support",
    intro: "Contact us about deliveries, rider applications, privacy, or a technical problem.",
    sections: [
      { title: "Email", paragraphs: ["simohamed.amara@gmail.com"] },
      { title: "Helpful information", bullets: [
        "Your KHF- order number if the question concerns a delivery.",
        "The phone number used for the order only when needed for verification.",
        "A short description of the problem.",
        "Never send passwords, API keys, or admin passcodes."
      ]},
      { title: "Privacy and deletion", paragraphs: ["For a data deletion or correction request, clearly state that your message is a privacy or data deletion request."] }
    ]
  }
} as const;

export default function ContactPage() {
  return <InfoPage content={content} />;
}
