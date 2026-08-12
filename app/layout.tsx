import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AssistantWidget } from "@/features/assistant/AssistantWidget";

export const metadata: Metadata = {
  title: "KI-System-Check",
  description:
    "Strukturierte Ersteinschätzung von KI-Systemen für Unternehmen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Header />
        <main>{children}</main>
        <AssistantWidget />
      </body>
    </html>
  );
}
