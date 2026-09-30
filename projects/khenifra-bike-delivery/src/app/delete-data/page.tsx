import InfoPage from "@/components/InfoPage";

const content = {
  ar: {
    title: "طلب حذف البيانات",
    updated: "خيارات الخصوصية",
    intro: "يمكنك طلب حذف البيانات الشخصية المرتبطة بك أو بطلباتك.",
    sections: [
      { title: "طريقة الطلب", paragraphs: ["أرسل طلبك إلى simohamed.amara@gmail.com واكتب في عنوان الرسالة: طلب حذف بيانات - Khenifra Delivery."] },
      { title: "معلومات تساعدنا على التحقق", bullets: [
        "رقم الهاتف المرتبط بطلب التوصيل أو طلب السائق.",
        "رقم الطلب KHF- إن وجد.",
        "وصف البيانات التي تريد حذفها."
      ]},
      { title: "ما الذي يحدث بعد الطلب؟", paragraphs: ["سنراجع الطلب ونتحقق من ارتباطه بالبيانات المطلوبة، ثم نحذف البيانات التي لا يلزم الاحتفاظ بها لأسباب قانونية أو أمنية أو محاسبية مشروعة."] },
      { title: "مهم", paragraphs: ["لا ترسل كلمة مرور أو مفتاح API أو رمز إدارة."] }
    ]
  },
  fr: {
    title: "Suppression des données",
    updated: "Choix de confidentialité",
    intro: "Vous pouvez demander la suppression des données personnelles liées à vous ou à vos commandes.",
    sections: [
      { title: "Envoyer une demande", paragraphs: ["Écrivez à simohamed.amara@gmail.com avec l'objet : Demande de suppression de données - Khenifra Delivery."] },
      { title: "Informations de vérification", bullets: [
        "Le numéro de téléphone associé à la livraison ou à la candidature de livreur.",
        "Le numéro de commande KHF- s'il existe.",
        "Une description des données à supprimer."
      ]},
      { title: "Après la demande", paragraphs: ["Nous vérifierons le lien avec les données concernées puis supprimerons les informations qui ne doivent pas être conservées pour une obligation légale, de sécurité ou comptable légitime."] },
      { title: "Important", paragraphs: ["N'envoyez jamais de mot de passe, clé API ou code administrateur."] }
    ]
  },
  en: {
    title: "Data Deletion Request",
    updated: "Privacy choices",
    intro: "You can request deletion of personal information associated with you or your delivery requests.",
    sections: [
      { title: "How to request deletion", paragraphs: ["Email simohamed.amara@gmail.com with the subject: Data Deletion Request - Khenifra Delivery."] },
      { title: "Information for verification", bullets: [
        "The phone number associated with the delivery or rider application.",
        "The KHF- order number, if available.",
        "A description of the information you want deleted."
      ]},
      { title: "What happens next", paragraphs: ["We will verify that the request relates to the data identified and delete information that is not required to be retained for a legitimate legal, security, or accounting reason."] },
      { title: "Important", paragraphs: ["Never send a password, API key, or admin passcode."] }
    ]
  }
} as const;

export default function DeleteDataPage() {
  return <InfoPage content={content} />;
}
