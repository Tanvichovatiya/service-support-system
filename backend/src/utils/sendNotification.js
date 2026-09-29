import notificationServices from "../services/notificationServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";
import { getIo } from "../socket/initSocket.js";

const getNotificationMessage = ({
  type,
  serviceRequest,
  staffName,
  staffCount,
  status,
  recipientType,
  action,
}) => {
  const title = serviceRequest?.title || "service request";

  switch (type) {
    
    case "new_request":
      return `New service request "${title}" has been created.`;

    case "request_assigned":
      if (staffCount) {
        return `Your service request "${title}" has been assigned to ${staffCount} staff member${
          staffCount > 1 ? "s" : ""
        }.`;
      }

      return `A new service request "${title}" has been assigned to you.`;

    case "status_changed":
      if (status === "in_progress") {
        if (recipientType === "user") {
          return staffName
            ? `Your service request "${title}" is now being handled by ${staffName}.`
            : `Your service request "${title}" is now in progress.`;
        }

        return staffName
          ? `${staffName} accepted service request "${title}".`
          : `Service request "${title}" is now in progress.`;
      }

      if (recipientType === "user") {
        return `Your service request "${title}" status changed to "${status}".`;
      }

      return `Service request "${title}" status changed to "${status}".`;

    case "request_reassigned":
      if (recipientType === "staff") {
        if (action === "removed") {
          return `You have been removed from service request "${title}".`;
        }

        if (action === "added") {
          return `You have been assigned to service request "${title}".`;
        }
      }

      if (recipientType === "user") {
        return `Your service request "${title}" has been reassigned.`;
      }

      return `Service request "${title}" has been reassigned.`;

    case "request_completed":
      return `Service request "${title}" has been completed.`;

    case "service_request_overdue":
      if (recipientType === "user") {
        return `Your service request "${title}" has been pending for more than 24 hours. Our support team has been notified and will review it shortly.`;
      }

      return `Service request "${title}" has been pending for more than 24 hours.`;

    default:
      return `There is an update for service request "${title}".`;
  }
};

export const sendNotification = async ({
  receiverId,
  senderId = null,
  requestId = null,
  type,
  message,
  data = {},
  room,
  event = "notification:new",
}) => {
  let serviceRequest = null;

  if (requestId) {
    serviceRequest = await ServiceRequestServices.getdatabyfindOne(
      {
        _id: requestId,
        isDeleted: false,
      },
      "title",
    );
  }

  const notificationMessage =
    message ||
    getNotificationMessage({
      type,
      serviceRequest,
      ...data,
    });

  const result = await notificationServices.createNotification({
    receiverId,
    senderId,
    requestId,
    type,
    message: notificationMessage,
    isRead: false,
  });

  const io = getIo();

  if (room) {
    io.to(room).emit(event, {
      notification: result.notification,
      unreadCount: result.unreadCount,
      data,
    });
  }

  return result;
};
