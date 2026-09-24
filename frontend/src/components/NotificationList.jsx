"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBell, FiCheck, FiRefreshCw } from "react-icons/fi";

import NotificationCard from "./NotificationCard";
import Pagination from "./pagination";

import {
  markAllNotificationsAsRead,
  setNotifications,
} from "@/redux/slice/notificationSlice";

import {
  getUnReadnotification,
  markAllReadApi,
} from "@/axiosApi/notificationApi";

const NotificationList = ({
  title = "Notifications",
  description = "Stay updated with your latest notifications.",
  isStaff = false,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const {
    notifications,
    page,
    limit,
    totalNotification,
    hasNextPage,
    hasPrevPage,
    unreadCount,
  } = useSelector((state) => state.notification);

  const fetchNotifications = useCallback(
    async (currentPage = 1) => {
      try {
        setLoading(true);

        const data = await getUnReadnotification(
          currentPage,
          limit
        );

        dispatch(
          setNotifications({
            notifications: data.notifications,
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          })
        );
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, limit]
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) {
      return;
    }

    try {
      setMarkingAll(true);

      await markAllReadApi();

      dispatch(markAllNotificationsAsRead());

      await fetchNotifications(page);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchNotifications(newPage);
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-admin-lg border border-border bg-surface p-5 shadow-admin-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-admin bg-brand-soft text-brand">
              <FiBell size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {title}
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                {description}
              </p>

              {unreadCount > 0 && (
                <p className="mt-2 text-xs font-medium text-brand">
                  {unreadCount} unread{" "}
                  {unreadCount === 1
                    ? "notification"
                    : "notifications"}
                </p>
              )}
            </div>
          </div>

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex w-fit items-center gap-2 rounded-admin border border-brand bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiCheck size={16} />

              {markingAll
                ? "Marking..."
                : "Mark All Read"}
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-admin-lg border border-border bg-surface">
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <FiRefreshCw
                size={18}
                className="animate-spin"
              />

              <span>Loading notifications...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-admin-lg border border-border bg-surface px-6 text-center shadow-admin-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
              <FiBell size={24} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-text-primary">
              No unread notifications
            </h2>

            <p className="mt-1 max-w-sm text-sm text-text-muted">
              You're all caught up. New notifications
              will appear here.
            </p>
          </div>
        )}

        {/* Notifications */}
        {!loading && notifications.length > 0 && (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  isStaff={isStaff}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              total={totalNotification}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
              limit={limit}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default NotificationList;