document.addEventListener("DOMContentLoaded", () => {
  const notificationList = document.getElementById("notificationList");
  const notificationPagination = document.getElementById("notificationPagination");
  const markAllButton = document.getElementById("markAllNotificationsRead");

  if (!notificationList) return;

  let currentPage = 1;
  const limit = 5;

  async function loadUnreadNotifications(page = 1) {
    try {
      currentPage = page;

      notificationList.innerHTML = `
        <div class="py-10 text-center text-sm text-gray-500">
          Loading notifications...
        </div>
      `;

      const response = await fetch(
        `/notification/getunread?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch notifications"
        );
      }

      const notifications = result.data?.notifications || [];
      const pagination = result.data?.pagination || {};

      renderNotifications(notifications);
      renderPagination(pagination);

      AdminNotification.setUnreadCount(
        pagination.total ?? 0
      );
    } catch (error) {
      console.error(
        "loadUnreadNotifications error:",
        error
      );

      notificationList.innerHTML = `
        <div class="rounded-lg border border-danger/20 bg-danger/5 p-6 text-center">
          <p class="text-sm text-danger">
            Failed to load notifications.
          </p>
        </div>
      `;
    }
  }

  function renderNotifications(notifications) {
    if (!notifications.length) {
      notificationList.innerHTML = `
        <div class="mx-auto w-full max-w-2xl rounded-xl border border-brand/30 bg-brand-soft p-4">
          <i class="fa-regular fa-bell mb-3 text-3xl text-gray-400"></i>

          <p class="text-sm text-gray-500">
            No unread notifications.
          </p>
        </div>
      `;

      return;
    }

    notificationList.innerHTML = notifications
      .map((notification) => {
        return `
          <div
            class="rounded-xl border border-brand/30 bg-brand-soft p-4 mx-auto"
            data-notification-id="${notification._id}"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand"
              >
                <i class="fa-solid fa-bell text-white"></i>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-text">
                      ${escapeHtml(notification.type || "Notification")}
                    </p>

                    <p class="mt-1 text-sm text-gray-600">
                      ${escapeHtml(notification.message || "")}
                    </p>
                  </div>

                </div>

                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-gray-500">
                    ${formatDate(notification.createdAt)}
                  </span>

                  <button
                    type="button"
                    class="mark-read-btn text-[15px] font-medium text-brand  hover:underline cursor-pointer"
                    data-id="${notification._id}"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  notificationList.addEventListener("click", async (event) => {
    const button = event.target.closest(".mark-read-btn");

    if (!button) return;

    const notificationId = button.dataset.id;

    await markAsRead(notificationId);
  });

  async function markAsRead(notificationId) {
    try {
      const response = await fetch(
        `/notification/read/${notificationId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to mark notification"
        );
      }

      const unreadCount =
        result.data?.unreadCount ?? 0;

      AdminNotification.setUnreadCount(
        unreadCount
      );

      await loadUnreadNotifications(
        currentPage
      );
    } catch (error) {
      console.error(
        "markAsRead error:",
        error
      );
    }
  }

  markAllButton?.addEventListener(
    "click",
    async () => {
      try {
        const response = await fetch(
          "/notification/markallread",
          {
            method: "PUT",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to mark all"
          );
        }

        AdminNotification.setUnreadCount(0);

        currentPage = 1;

        await loadUnreadNotifications(1);
      } catch (error) {
        console.error(
          "markAllNotificationsRead error:",
          error
        );
      }
    }
  );

  notificationPagination?.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        ".notification-page"
      );

      if (!button) return;

      const page = Number(
        button.dataset.page
      );

      if (!page || page === currentPage) {
        return;
      }

      loadUnreadNotifications(page);
    }
  );

  function renderPagination(pagination) {
    if (!notificationPagination) return;

    const page = Number(pagination.page) || 1;
    const totalPages =
      Number(pagination.totalPages) || 1;

    if (totalPages <= 1) {
      notificationPagination.innerHTML = "";
      return;
    }

    let html = `
      <div class="mt-6 flex items-center justify-center gap-2">
    `;

    if (page > 1) {
      html += `
        <button
          type="button"
          data-page="${page - 1}"
          class="notification-page inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-text transition hover:bg-page-background cursor-pointer"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      `;
    } else {
      html += `
        <span
          class="inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-gray-100 px-3 py-2 text-sm font-medium text-gray-400 cursor-pointer"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </span>
      `;
    }

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button
          type="button"
          data-page="${i}"
          class="notification-page cursor-pointer inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
            i === page
              ? "border-brand bg-brand text-white"
              : "border-border bg-card text-text hover:bg-page-background"
          }"
        >
          ${i}
        </button>
      `;
    }

    if (page < totalPages) {
      html += `
        <button
          type="button"
          data-page="${page + 1}"
          class="notification-page inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-text transition hover:bg-page-background"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;
    } else {
      html += `
        <span
          class="inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-gray-100 px-3 py-2 text-sm font-medium text-gray-400"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </span>
      `;
    }

    html += `
      </div>
    `;

    notificationPagination.innerHTML = html;
  }

  loadUnreadNotifications();
});