"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  FiBell,
  FiCheck,
  FiEye,
  FiUser,
  FiClock,
} from "react-icons/fi";

import { acceptAssignedRequest } from "@/axiosApi/serviceRequestApi";

import {
  markNotificationAsRead,
} from "@/redux/slice/notificationSlice";

import {
  markReadApi,
} from "@/axiosApi/notificationApi";

const NotificationCard = ({
  notification,
  isStaff = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [markingRead, setMarkingRead] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const isAssigned =
    notification?.type === "request_assigned";

  const isRead = notification?.isRead;

  const requestId = notification?.requestId;

  const senderName = notification?.sender
    ? `${notification.sender.firstname || ""} ${
        notification.sender.lastname || ""
      }`.trim()
    : "System";

  const formattedDate = notification?.createdAt
    ? new Date(
        notification.createdAt
      ).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  // ==========================================
  // MARK AS READ
  // ==========================================

  const handleMarkRead = async () => {
    if (isRead || markingRead) {
      return;
    }

    try {
      setMarkingRead(true);

      const result = await markReadApi(
        notification._id
      );

      dispatch(
        markNotificationAsRead({
          notificationId: notification._id,
          unreadCount: result.unreadCount,
        })
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    } finally {
      setMarkingRead(false);
    }
  };

  // ==========================================
  // STAFF ACCEPT REQUEST
  // ==========================================

  const handleAccept = async () => {
    if (!requestId || accepting) {
      return;
    }

    try {
      setAccepting(true);

      await acceptAssignedRequest(requestId);

      const result = await markReadApi(
        notification._id
      );

      dispatch(
        markNotificationAsRead({
          notificationId: notification._id,
          unreadCount: result.unreadCount,
        })
      );

      router.push(`/staff/requests/${requestId}`);
    } catch (error) {
      console.error(
        "Failed to accept service request:",
        error
      );
    } finally {
      setAccepting(false);
    }
  };

  // ==========================================
  // VIEW REQUEST
  // ==========================================

  const handleView = () => {
    if (!requestId) {
      return;
    }

    const requestPath = isStaff
      ? `/staff/requests/${requestId}`
      : `/user/requests/${requestId}`;

    router.push(requestPath);
  };

  return (
    <div
      className={`rounded-admin-lg border p-4 transition-all duration-200 ${
        isRead
          ? "border-border-light bg-surface"
          : "border-brand-muted bg-brand-soft/40 shadow-admin-sm"
      }`}
    >
      <div className="flex gap-4">
        {/* Sender Avatar */}
        <div className="shrink-0">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-brand ring-1 ring-border">
            {notification?.sender?.profilePic ? (
              <img
                src={notification.sender.profilePic}
                alt={senderName}
                className="h-full w-full object-cover"
              />
            ) : (
              <FiUser size={19} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">
                  {senderName}
                </h3>

                {!isRead && (
                  <span className="h-2 w-2 rounded-full bg-danger" />
                )}
              </div>

              <span className="mt-1 inline-flex rounded-full bg-background-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                {notification?.type?.replaceAll(
                  "_",
                  " "
                )}
              </span>
            </div>

            {!isRead && (
              <span className="inline-flex w-fit rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold text-white">
                New
              </span>
            )}
          </div>

          {/* Message */}
          <p
            className={`mt-3 text-sm leading-6 ${
              isRead
                ? "text-text-secondary"
                : "font-medium text-text-primary"
            }`}
          >
            {notification?.message}
          </p>

          {/* Date */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <FiClock size={13} />
            <span>{formattedDate}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
        
            {isStaff &&
              isAssigned &&
              requestId && (
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={accepting}
                  className="inline-flex items-center gap-2 rounded-admin bg-success px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-success-dark disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  <FiCheck size={14} />

                  {accepting
                    ? "Accepting..."
                    : "Accept"}
                </button>
              )}

            {requestId && (
              <button
                type="button"
                onClick={handleView}
                className="inline-flex items-center gap-2 rounded-admin border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-brand transition hover:border-brand hover:bg-brand-soft cursor-pointer"
              >
                <FiEye size={14} />
                View
              </button>
            )}

            {!isRead && (
              <button
                type="button"
                onClick={handleMarkRead}
                disabled={markingRead}
                className="inline-flex items-center gap-2 rounded-admin border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary transition hover:border-brand hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <FiBell size={14} />

                {markingRead
                  ? "Marking..."
                  : "Mark as Read"}
              </button>
            )}

          
            {isRead && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <FiCheck size={13} />
                Read
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;