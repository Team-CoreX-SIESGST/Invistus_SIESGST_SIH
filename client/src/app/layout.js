import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FloatChat - ARGO Ocean Data Assistant",
  description:
    "AI-Powered Conversational Interface for ARGO Ocean Data Discovery and Visualization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
