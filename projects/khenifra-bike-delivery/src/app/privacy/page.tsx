import InfoPage from "@/components/InfoPage";

const content = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 30 سبتمبر 2026",
    intro: "توضح هذه السياسة كيف تجمع خدمة توصيل خنيفرة بياناتك وتستخدمها وتحميها أثناء استخدام الموقع أو التطبيق.",
    sections: [
      { title: "البيانات التي نجمعها", bullets: [
        "بيانات التواصل مثل الاسم ورقم الهاتف.",
        "بيانات التوصيل مثل عنوان الاستلام وعنوان التسليم والملاحظات المرتبطة بالطلب.",
        "بيانات الطلب مثل نوع التوصيل، حالة الطلب، أوقات المعالجة والسعر عند توفره.",
        "بالنسبة للسائقين: الاسم، الهاتف، نوع وسيلة التوصيل، اللغة المفضلة وحالة طلب الانضمام.",
        "بيانات تقنية أساسية لازمة لتشغيل الخدمة والجلسة وأمن النظام."
      ]},
      { title: "كيف نستخدم البيانات", bullets: [
        "إنشاء طلبات التوصيل وتنفيذها ومتابعة حالتها.",
        "التواصل بشأن الطلبات أو طلبات الانضمام كسائق.",
        "إدارة السائقين والتعيين والمتابعة التشغيلية.",
        "تحسين أمان الخدمة ومنع الاستخدام غير المصرح به.",
        "تحليل أداء الخدمة بشكل إجمالي عند الحاجة."
      ]},
      { title: "المشاركة مع الأطراف الأخرى", paragraphs: [
        "لا نبيع بياناتك الشخصية. قد تتم معالجة البيانات بواسطة مزودي البنية التقنية الذين نستخدمهم لتشغيل الخدمة، مثل Appwrite لاستضافة قاعدة البيانات وخدمات التطبيق.",
        "قد نشارك المعلومات اللازمة فقط مع السائق المعيّن لإتمام عملية الاستلام والتسليم، مثل العنوان ورقم التواصل المرتبط بالطلب."
      ]},
      { title: "الموقع الجغرافي", paragraphs: [
        "يمكن للعميل اختيار مشاركة موقع الاستلام الدقيق لتسهيل إنشاء الطلب. ويمكن للسائق مشاركة موقعه الدقيق عندما يختار أن يكون متاحاً، ويتم تحديث آخر موقع أثناء فتح لوحة السائق وتنفيذ توصيل نشط لتسهيل التعيين والتتبع. لا تجمع النسخة الحالية موقع السائق بشكل مستمر في الخلفية بعد إغلاق التطبيق أو عند إيقاف التوفر."
      ]},
      { title: "الاحتفاظ والحذف", paragraphs: [
        "نحتفظ بالبيانات فقط للمدة اللازمة لتشغيل الخدمة والوفاء بالالتزامات القانونية أو التشغيلية. يمكنك طلب حذف بياناتك من صفحة حذف البيانات أو عبر صفحة الاتصال."
      ]},
      { title: "الأمان", paragraphs: [
        "نستخدم صلاحيات وصول محدودة، وأذونات على مستوى الصفوف، ومفاتيح خادم خاصة للوظائف الإدارية. لا ينبغي مشاركة رموز الإدارة أو مفاتيح الخادم مع أي شخص."
      ]},
      { title: "الأطفال", paragraphs: [
        "الخدمة ليست مصممة لتقديم خدمات مستقلة للأطفال. إذا علمنا بجمع بيانات شخصية لطفل دون أساس مناسب فسنقوم بمراجعتها وحذفها عند الاقتضاء."
      ]},
      { title: "حقوقك", bullets: [
        "طلب معرفة البيانات المرتبطة بك.",
        "طلب تصحيح بيانات غير دقيقة.",
        "طلب حذف بياناتك عندما يكون ذلك ممكناً قانونياً وتشغيلياً.",
        "التواصل معنا بشأن أي سؤال متعلق بالخصوصية."
      ]},
      { title: "التواصل", paragraphs: [
        "لأسئلة الخصوصية أو طلبات البيانات استخدم صفحة الاتصال داخل التطبيق."
      ]}
    ]
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 30 septembre 2026",
    intro: "Cette politique explique comment Khenifra Delivery collecte, utilise et protège vos données lorsque vous utilisez le site ou l'application.",
    sections: [
      { title: "Données collectées", bullets: [
        "Coordonnées telles que le nom et le numéro de téléphone.",
        "Informations de livraison : adresse de collecte, adresse de livraison et notes liées à la commande.",
        "Informations de commande : catégorie, statut, horaires de traitement et prix lorsqu'il est disponible.",
        "Pour les livreurs : nom, téléphone, type de véhicule, langue préférée et statut de candidature.",
        "Données techniques nécessaires au fonctionnement, aux sessions et à la sécurité."
      ]},
      { title: "Utilisation des données", bullets: [
        "Créer, exécuter et suivre les livraisons.",
        "Communiquer au sujet des commandes ou candidatures de livreurs.",
        "Gérer les livreurs, l'affectation et les opérations.",
        "Protéger le service contre les accès non autorisés.",
        "Améliorer les performances du service."
      ]},
      { title: "Partage", paragraphs: [
        "Nous ne vendons pas vos données personnelles. Des fournisseurs techniques, notamment Appwrite, peuvent traiter des données pour héberger et faire fonctionner le service.",
        "Les informations strictement nécessaires peuvent être partagées avec le livreur affecté afin d'effectuer la collecte et la livraison."
      ]},
      { title: "Localisation", paragraphs: [
        "Le client peut choisir de partager sa position précise de collecte. Le livreur peut partager sa position précise lorsqu'il se rend disponible, et sa dernière position peut être actualisée pendant que le tableau du livreur est ouvert et qu'une livraison est active afin de faciliter l'affectation et le suivi. La version actuelle ne collecte pas en continu la position du livreur en arrière-plan après la fermeture de l'application ou lorsqu'il n'est plus disponible."
      ]},
      { title: "Conservation et suppression", paragraphs: [
        "Les données sont conservées uniquement pendant la durée nécessaire au fonctionnement du service et aux obligations applicables. Vous pouvez demander leur suppression via la page Suppression des données ou la page Contact."
      ]},
      { title: "Sécurité", paragraphs: [
        "Nous utilisons des accès limités, des permissions au niveau des lignes et des clés serveur privées pour les opérations administratives."
      ]},
      { title: "Mineurs", paragraphs: [
        "Le service n'est pas conçu pour fournir de manière autonome des services aux enfants. Si des données d'un enfant sont identifiées sans base appropriée, elles seront examinées et supprimées lorsque nécessaire."
      ]},
      { title: "Vos droits", bullets: [
        "Demander l'accès aux données vous concernant.",
        "Demander la correction de données inexactes.",
        "Demander la suppression lorsque cela est légalement et opérationnellement possible.",
        "Nous contacter pour toute question relative à la confidentialité."
      ]},
      { title: "Contact", paragraphs: [
        "Pour toute question de confidentialité ou demande relative aux données, utilisez la page Contact de l'application."
      ]}
    ]
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: September 30, 2026",
    intro: "This policy explains how Khenifra Delivery collects, uses, and protects information when you use the website or app.",
    sections: [
      { title: "Data we collect", bullets: [
        "Contact details such as name and phone number.",
        "Delivery information such as pickup address, drop-off address, and order notes.",
        "Order information including category, status, processing times, and price when available.",
        "For riders: name, phone, vehicle type, preferred language, and application status.",
        "Basic technical data required for service operation, sessions, and security."
      ]},
      { title: "How we use data", bullets: [
        "Create, operate, and track delivery requests.",
        "Communicate about deliveries or rider applications.",
        "Manage riders, assignment, and service operations.",
        "Protect the service from unauthorized access and abuse.",
        "Improve service reliability and performance."
      ]},
      { title: "Sharing", paragraphs: [
        "We do not sell personal information. Technical service providers, including Appwrite, may process information to host and operate the service.",
        "Only information necessary to complete a delivery may be shared with the assigned rider, such as relevant addresses and contact numbers."
      ]},
      { title: "Location data", paragraphs: [
        "Customers may choose to share a precise pickup location. Riders may share precise location when they choose to be available, and their last known location may be refreshed while the rider dashboard is open and a delivery is active to support assignment and customer tracking. The current version does not continuously collect rider location in the background after the app is closed or when the rider is offline."
      ]},
      { title: "Retention and deletion", paragraphs: [
        "We keep information only for as long as needed to operate the service and meet applicable legal or operational requirements. You can request deletion through the Data Deletion page or Contact page."
      ]},
      { title: "Security", paragraphs: [
        "We use restricted access, row-level permissions, and private server credentials for administrative functions. Administrative passcodes and server keys must not be shared."
      ]},
      { title: "Children", paragraphs: [
        "The service is not designed to provide independent delivery services to children. If we learn that personal data from a child was collected without an appropriate basis, we will review and remove it where required."
      ]},
      { title: "Your choices", bullets: [
        "Request access to information associated with you.",
        "Request correction of inaccurate information.",
        "Request deletion where legally and operationally possible.",
        "Contact us with any privacy question."
      ]},
      { title: "Contact", paragraphs: [
        "For privacy questions or data requests, use the Contact page in the app."
      ]}
    ]
  }
} as const;

export default function PrivacyPage() {
  return <InfoPage content={content} />;
}
