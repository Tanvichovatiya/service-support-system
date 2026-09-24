const socket = io({
  withCredentials: true,
});

function handleNewAdminNotification(notification) {
  if (!notification) return;

  console.log("Admin notification:", notification);

  if (window.AdminNotification) {
    AdminNotification.increaseUnreadCount();
  }
}

socket.on("connect", () => {
  console.log("Admin connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Admin disconnected:", reason);
});

socket.on("service-request:new", (data) => {
  console.log("New service request:", data);

  handleNewAdminNotification(data?.notification);
});

socket.on("service-request:status-updated", (data) => {
  console.log("Request status updated:", data);

  handleNewAdminNotification(data?.notification);
});

socket.on("service-request:cancelled", (data) => {
  console.log("Request cancelled:", data);

  handleNewAdminNotification(
    data?.notification || {
      type: "request_cancelled",
      message: "Service request has been cancelled.",
    }
  );
});

socket.on("service-request:file-uploaded", (data) => {
  console.log("File uploaded:", data);

  handleNewAdminNotification(
    data?.notification || {
      type: "request_file_uploaded",
      message: "A new file was uploaded to a service request.",
    }
  );
});

socket.on("service-request:comment-added", (data) => {
  console.log("Comment added:", data);

  handleNewAdminNotification(
    data?.notification || {
      type: "new_comment",
      message: "A new comment was added to a service request.",
    }
  );
});

const logoutBtn =
  document.getElementById("adminLogoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (socket.connected) {
      console.log("Disconnecting admin socket...");

      socket.disconnect();
    }

    window.location.href = "/admin/logout";
  });
}