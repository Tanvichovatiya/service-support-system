"use client";

import NotificationList from "@/components/NotificationList";

const StaffNotificationPage = () => {
  return (
    <NotificationList
      title="Notifications"
      description="View your service assignments and latest updates."
      isStaff={true}
    />
  );
};

export default StaffNotificationPage;