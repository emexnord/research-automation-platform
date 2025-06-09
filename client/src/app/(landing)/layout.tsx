import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/NavigationBar";
import type React from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col font-roboto">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
