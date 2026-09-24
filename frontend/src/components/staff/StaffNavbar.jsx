"use client";

import Navbar from "@/components/Navbar";
import {
  FaHome,
  FaTachometerAlt,
  FaClipboardList,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";

export default function StaffNavbar({
  onMenuClick,
  mobileMenuOpen,
  user,
  unreadCount = 0,
  onLogout,
}) {
  const navItems = [
    {
      label: "Home",
      href: "/staff/home",
      icon: FaHome,
    },
    {
      label: "Dashboard",
      href: "/staff/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Requests",
      href: "/staff/requests/all",
      icon: FaClipboardList,
    },
    {
      label: "About",
      href: "/staff/about",
      icon: FaInfoCircle,
    },
    {
      label: "Contact Us",
      href: "/staff/contactus",
      icon: FaEnvelope,
    },
  ];

  return (
    <Navbar
      navItems={navItems}
      logoHref="/staff/"
      user={user}
      profileHref="/staff/profile"
      profileRole="Staff"
      unreadCount={unreadCount}
      notificationHref="/staff/notifications"
      messageHref="/staff/messages"
      onLogout={onLogout}
      onMenuClick={onMenuClick}
      mobileMenuOpen={mobileMenuOpen}
      logoutStyle="danger"
    />
  );
}