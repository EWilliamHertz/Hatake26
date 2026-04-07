import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Provider from "@/components/Provider";
import NavWrapper from "@/components/NavWrapper";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
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
