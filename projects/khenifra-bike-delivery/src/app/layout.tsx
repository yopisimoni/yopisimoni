import "./globals.css";
import PwaRegister from "./PwaRegister";

export const viewport = {
  themeColor: "#163d27",
};

export const metadata = {
  title: "توصيل خنيفرة | Khenifra Delivery",
  description: "خدمة توصيل محلية سريعة داخل خنيفرة.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
