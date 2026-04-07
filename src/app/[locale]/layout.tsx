import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import Provider from "@/components/Provider";
import NavWrapper from "@/components/NavWrapper";
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

  // Dynamically import messages for the current locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <title>Hatake KB</title>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Provider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <NavWrapper>{children}</NavWrapper>
          </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
