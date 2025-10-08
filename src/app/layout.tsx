import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Personal Forest Blog - Stories, Articles & Adventures",
  description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  keywords: "personal blog, stories, articles, nature writing, forest tales, adventures",
  openGraph: {
    title: "My Personal Forest Blog - Stories, Articles & Adventures",
    description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  },
  twitter: {
    title: "My Personal Forest Blog - Stories, Articles & Adventures",
    description: "Personal blog sharing my stories, articles, and adventures inspired by nature and magical experiences",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
