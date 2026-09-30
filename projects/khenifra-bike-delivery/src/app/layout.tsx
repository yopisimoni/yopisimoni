import "./globals.css";

export const metadata = {
  title: "Khenifra Delivery",
  description: "Fast local delivery across Khenifra.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
