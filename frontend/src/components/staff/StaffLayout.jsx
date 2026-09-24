
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "../Footer";
import StaffNavbar from "./StaffNavbar";

export default function StaffLayout({ children }) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");

    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">

      <StaffNavbar
        onMenuClick={() => setMobileMenuOpen((prev) => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        onLogout={handleLogout}
      />

      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <Footer role="staff"/>
    </div>
  );
}
