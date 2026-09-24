
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBell,
  FiSend,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import logo from "@/assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUnReadCount } from "@/axiosApi/notificationApi";
import { setUnreadCount } from "@/redux/slice/notificationSlice";

export default function Navbar({
  navItems = [],
  logoHref = "/",
  user,
  profileHref = "/profile",
  profileLabel = "User",
  profileRole = "Customer",
  notificationHref = "/notifications",

  messageHref = "/messages",
  onLogout,
  onMenuClick,
  mobileMenuOpen = false,
  logoutStyle = "danger",
}) {
  const pathname = usePathname();
  const dispatch = useDispatch()

  const isActive = (href) => {
    if (!href) return false;

    if (href === "/user/dashboard" || href === "/staff/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };


  const unreadMsg = useSelector(
    (state) => state.chat.unreadTotal
  );
  const { unreadCount } = useSelector(
    (state) => state.notification
  );
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const result = await getUnReadCount();

        dispatch(setUnreadCount(result.unreadCount || 0));
      } catch (error) {
        console.log("Failed to get notification unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [dispatch]);

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] border-b border-accent-soft bg-brand/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Left Side */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onMenuClick}
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-soft text-text-secondary transition-all duration-200 hover:border-brand-muted hover:bg-brand-soft hover:text-brand lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <Link
              href={logoHref}
              className="flex shrink-0 items-center"
            >
              <div className="flex h-16 w-24 items-center justify-center">
                <Image
                  src={logo}
                  alt="Service Support"
                  width={140}
                  height={70}
                  className="h-14 w-30 object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${active
                    ? "bg-brand-soft text-brand"
                    : "text-accent-soft hover:bg-surface-soft hover:text-brand"
                    }`}
                >
                  {/* {Icon && (
                    <Icon
                      size={17}
                      className="transition-transform duration-200 group-hover:scale-105"
                    />
                  )} */}

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

         
          <div className="flex shrink-0 items-center gap-2">
            {/* Messages */}
            <Link
              href={messageHref}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-accent-soft transition-all duration-200 hover:border-border hover:bg-surface-soft hover:text-brand"
              aria-label="Messages"
              title="Messages"
            >
              <FiSend size={19} />

              {unreadMsg > 0 && (
                <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white ring-2 ring-brand">
                  {unreadMsg > 9 ? "9+" : unreadMsg}
                </span>
              )}
            </Link>

            <Link
              href={notificationHref}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-accent-soft transition-all duration-200 hover:border-border hover:bg-surface-soft hover:text-brand"
              aria-label="Notifications"
              title="Notifications"
            >
              <FiBell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white ring-2 ring-brand">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href={profileHref}
              className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-surface-soft"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-brand ring-1 ring-brand-muted transition group-hover:ring-brand-light">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user?.firstname || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser size={17} />
                )}
              </div>

              <div className="hidden text-left md:block">
                <p className="max-w-[110px] truncate text-sm font-semibold text-brand-soft">
                  {user?.firstname || profileLabel}
                </p>

                <p className="text-[11px] font-medium text-white">
                  {profileRole}
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={18} />
            </button>

          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 border-b border-border bg-white shadow-xl lg:hidden">
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4 sm:px-6">

            <div className="mb-4 rounded-2xl bg-brand px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                Navigation
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                Manage your support requests
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMenuClick}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200 ${active
                      ? "border-brand bg-brand text-white shadow-sm"
                      : "border-border bg-surface-soft text-text-secondary hover:border-brand-muted hover:bg-brand-soft hover:text-brand"
                      }`}
                  >
                    {/* Icon */}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active
                        ? "bg-white/15"
                        : "bg-white shadow-sm ring-1 ring-border"
                        }`}
                    >
                      {Icon && (
                        <Icon
                          size={20}
                          color={active ? "#ffffff" : "#40595A"}
                          style={{
                            display: "block",
                            width: "20px",
                            height: "20px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </span>

                    {/* Label */}
                    <span
                      className={`flex-1 text-left text-sm font-semibold ${active ? "text-white" : "text-text-secondary"
                        }`}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {active && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                    )}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-3 h-px bg-border" />

              {/* Messages */}
              <Link
                href={messageHref}
                onClick={onMenuClick}
                className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3 py-3 text-text-secondary transition-all duration-200 hover:border-brand-muted hover:bg-brand-soft hover:text-brand"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm ring-1 ring-border transition-all duration-200 group-hover:bg-brand group-hover:text-white">
                  <FiSend
                    size={19}
                    strokeWidth={2}
                  />
                </span>

                <span className="flex-1 text-sm font-semibold">
                  Messages
                </span>

                {unreadMsg > 0 && (
                  <span className="flex min-w-[24px] items-center justify-center rounded-full bg-danger px-2 py-1 text-[10px] font-bold text-white">
                    {unreadMsg > 9 ? "9+" : unreadMsg}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href={notificationHref}
                onClick={onMenuClick}
                className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3 py-3 text-text-secondary transition-all duration-200 hover:border-brand-muted hover:bg-brand-soft hover:text-brand"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm ring-1 ring-border transition-all duration-200 group-hover:bg-brand group-hover:text-white">
                  <FiBell
                    size={19}
                    strokeWidth={2}
                  />
                </span>

                <span className="flex-1 text-sm font-semibold">
                  Notifications
                </span>

                {unreadCount > 0 && (
                  <span className="flex min-w-[24px] items-center justify-center rounded-full bg-danger px-2 py-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                href={profileHref}
                onClick={onMenuClick}
                className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3 py-3 text-text-secondary transition-all duration-200 hover:border-brand-muted hover:bg-brand-soft hover:text-brand"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-brand shadow-sm ring-1 ring-border">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user?.firstname || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser
                      size={19}
                      strokeWidth={2}
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {user?.firstname || profileLabel}
                  </p>

                  <p className="truncate text-xs text-text-muted">
                    {profileRole}
                  </p>
                </div>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="group mt-1 flex w-full items-center gap-3 rounded-2xl border border-danger-light bg-danger-light px-3 py-3 text-danger transition-all duration-200 hover:bg-danger hover:text-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 transition-all duration-200 group-hover:bg-white/15">
                  <FiLogOut
                    size={19}
                    strokeWidth={2}
                  />
                </span>

                <span className="flex-1 text-left text-sm font-semibold">
                  Logout
                </span>
              </button>

            </nav>
          </div>
        </div>
      )}

    </>
  );
}
