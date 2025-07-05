import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google"
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeZone Converter - Conversor de Zonas Horarias",
  description: "Convierte fechas y horas entre diferentes zonas horarias del mundo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
