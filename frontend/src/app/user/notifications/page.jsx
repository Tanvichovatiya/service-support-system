"use client";

import NotificationList from "@/components/NotificationList";

const UserNotificationPage = () => {
  return (
    <NotificationList
      title="Notifications"
      description="Stay updated with your service requests and latest updates."
      isStaff={false}
    />
  );
};

export default UserNotificationPage;