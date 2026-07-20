import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { SocketProvider } from "@/context/SocketContext";
import DevPanel from "@/components/dev/DevPanel";


export const metadata: Metadata = {
  title: "Pranzoo — Animal Rescue Platform",
  description: "Connect, Report, Rescue. A technology-driven platform to facilitate stray animal rescue, adoption, and responsible pet ownership across India.",
  keywords: ["animal rescue", "stray animals", "adoption", "India", "Pranzoo"],
  openGraph: {
    title: "Pranzoo — Animal Rescue Platform",
    description: "Report stray animals, find rescue organizations, adopt pets, and volunteer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              {children}
              <DevPanel />
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
