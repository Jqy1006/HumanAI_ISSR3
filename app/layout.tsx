import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "HumanAI ISSR3 Screening Test",
  description: "Minimal trust attribution experiment prototype"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
