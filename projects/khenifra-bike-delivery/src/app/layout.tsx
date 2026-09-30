import "./globals.css";

export const metadata = {
  title: "توصيل خنيفرة | Khenifra Delivery",
  description: "خدمة توصيل محلية سريعة داخل خنيفرة.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
