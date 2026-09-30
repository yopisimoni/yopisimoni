import InfoPage from "@/components/InfoPage";

const content = {
  ar: {
    title: "من نحن",
    updated: "توصيل محلي لخنيفرة",
    intro: "توصيل خنيفرة مشروع محلي يهدف إلى جعل إرسال الطلبات الصغيرة داخل المدينة أبسط وأسرع وأكثر وضوحاً.",
    sections: [
      { title: "ما الذي نقدمه؟", paragraphs: ["نركز في النسخة الأولى على التوصيل من نقطة إلى نقطة: طلبات المطاعم، المشتريات، الوثائق والطرود الصغيرة."] },
      { title: "لمن؟", paragraphs: ["للأفراد والمتاجر والمطاعم المحلية، مع شبكة من السائقين الذين يتم التحقق من طلبات انضمامهم قبل التفعيل."] },
      { title: "كيف نبدأ؟", paragraphs: ["نبدأ بنطاق محلي محدود داخل خنيفرة، ونعتمد على اختبار حقيقي للطلبات قبل توسيع الوظائف أو المنطقة."] },
      { title: "هدفنا", paragraphs: ["بناء خدمة مفيدة من اليوم الأول: طلب واضح، سائق معتمد، حالة يمكن متابعتها، وتسليم بسيط دون تعقيد غير ضروري."] }
    ]
  },
  fr: {
    title: "À propos",
    updated: "Livraison locale à Khenifra",
    intro: "Khenifra Delivery est un projet local conçu pour rendre les petites livraisons en ville plus simples, plus rapides et plus transparentes.",
    sections: [
      { title: "Notre service", paragraphs: ["Le pilote se concentre sur la livraison point à point : repas, achats, documents et petits colis."] },
      { title: "Pour qui ?", paragraphs: ["Pour les particuliers, commerces et restaurants locaux, avec un réseau de livreurs dont les candidatures sont examinées avant activation."] },
      { title: "Notre lancement", paragraphs: ["Nous commençons avec une zone locale limitée à Khenifra et validons le service avec de vraies livraisons avant d'élargir les fonctionnalités ou la couverture."] },
      { title: "Notre objectif", paragraphs: ["Offrir une expérience utile dès le premier jour : demande claire, livreur approuvé, statut visible et livraison simple."] }
    ]
  },
  en: {
    title: "About Us",
    updated: "Local delivery for Khenifra",
    intro: "Khenifra Delivery is a local project built to make small deliveries across the city simpler, faster, and clearer.",
    sections: [
      { title: "What we do", paragraphs: ["The pilot focuses on point-to-point delivery for restaurant orders, groceries, documents, and small parcels."] },
      { title: "Who it is for", paragraphs: ["Individuals, local shops, and restaurants, supported by a rider network whose applications are reviewed before activation."] },
      { title: "How we are launching", paragraphs: ["We are starting with a limited local area in Khenifra and validating the service through real deliveries before expanding features or coverage."] },
      { title: "Our goal", paragraphs: ["Build something useful from day one: a clear request, an approved rider, visible status, and a simple delivery experience."] }
    ]
  }
} as const;

export default function AboutPage() {
  return <InfoPage content={content} />;
}
