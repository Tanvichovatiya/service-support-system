"use client";

import Navbar from "@/components/Navbar";
import { FiHome, FiGrid, FiFileText, FiPlusCircle } from "react-icons/fi";
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";


export default function UserNavbar({
  onMenuClick,
  mobileMenuOpen,
  user,
  unreadCount = 0,
  onLogout,
}) {
  const navItems = [
    {
      label: "Home",
      href: "/user/home",
       icon: FiHome,
    },
    {
      label: "My Requests",
      href: "/user/requests/my",
      icon: FiFileText,
    },
    {
      label: "Create Request",
      href: "/user/requests/create",
      icon: FiPlusCircle,
    },
    {
      label:"About",
      href:"/user/about",
       icon: FaInfoCircle,
    },
    {
      label:"ContactUs",
      href:"/user/contactus",
      icon: FaEnvelope,
    }
  ];

  return (
    <Navbar
      navItems={navItems}
      logoHref="/user/"

      user={user}
      profileHref="/user/profile"
      profileRole="Customer"

      unreadCount={unreadCount}
      notificationHref="/user/notifications"

      messageHref="/user/messages"

      onLogout={onLogout}
      onMenuClick={onMenuClick}
      mobileMenuOpen={mobileMenuOpen}

      logoutStyle="danger"
    />
  );
}