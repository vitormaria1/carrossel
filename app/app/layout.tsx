import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrossel App",
  description: "Criação, publicação e agendamento de carrosséis para Instagram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
