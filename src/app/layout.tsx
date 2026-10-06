import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import Header from "@/components/Header";
import { getMenuCategories } from "@/lib/categoryData";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "My Personal Forest Blog - Stories, Articles & Adventures",
    template: "%s | My Forest Blog",
  },
  description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  keywords: "personal blog, stories, articles, nature writing, forest tales, adventures",
  openGraph: {
    siteName: "My Forest Blog",
    locale: "vi_VN",
    type: "website",
    title: "My Personal Forest Blog - Stories, Articles & Adventures",
    description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  },
  twitter: {
    title: "My Personal Forest Blog - Stories, Articles & Adventures",
    description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Header menuCategories={await getMenuCategories()} />
        {children}
      </body>
    </html>
  );
}
