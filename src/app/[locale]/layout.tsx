import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import Provider from "@/components/Provider";
import NavWrapper from "@/components/NavWrapper";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const locales = ["en", "sv"];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Get messages using next-intl's getMessages function
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <title>Hatake KB</title>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Provider>
          <NextIntlClientProvider messages={messages}>
            <NavWrapper>{children}</NavWrapper>
          </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
