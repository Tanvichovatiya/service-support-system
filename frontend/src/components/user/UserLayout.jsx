
"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserNavbar from "./UserNavbar";
import Footer from "../Footer";


export default function UserLayout({ children }) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar
        onMenuClick={() => setMobileMenuOpen((prev) => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        onLogout={handleLogout}
      />

      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <Footer role="user" />
    </div>
  );
}