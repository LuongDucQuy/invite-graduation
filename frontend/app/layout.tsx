import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Graduation Ceremony — Lương Đức Quý | Thiệp Mời Tốt Nghiệp",
  description:
    "Trân trọng kính mời bạn đến tham dự Lễ Tốt Nghiệp của Lương Đức Quý.",
  openGraph: {
    title: "Graduation Ceremony — Lương Đức Quý",
    description:
      "Trân trọng kính mời bạn đến tham dự Lễ Tốt Nghiệp của Lương Đức Quý.",
    url: "https://invite-graduation.vercel.app/",
    siteName: "Graduation Invitation",
    images: [
      {
        url: "https://res.cloudinary.com/kodlrwce/image/upload/v1788748049/6530f7b3caff4aa113ee.jpg",
        width: 600,
        height: 300,
        alt: "Graduation Ceremony",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="antialiased bg-cream-50 text-slate-900 selection:bg-champagne-400 selection:text-navy-950">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
