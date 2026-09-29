import { sendNotification } from "./sendNotification.js";

export const sendReassignmentNotifications = async ({
  serviceRequest,
  adminId,
  removedStaff,
  addedStaff,
  staffIds,
  status,
}) => {
  await Promise.all([
    ...removedStaff.map((staff) =>
      sendNotification({
        receiverId: staff.userId,
        senderId: adminId,
        requestId: serviceRequest._id,
        type: "request_reassigned",
        room: `staff:${staff.userId}`,
        event: "service-request:removed",
        data: {
          staffId: staff._id,
          recipientType: "staff",
          action: "removed",
        },
      }),
    ),

    ...addedStaff.map((staff) =>
      sendNotification({
        receiverId: staff.userId,
        senderId: adminId,
        requestId: serviceRequest._id,
        type: "request_reassigned",
        room: `staff:${staff.userId}`,
        event: "service-request:reassigned",
        data: {
          staffId: staff._id,
          staffIds,
          status,
          recipientType: "staff",
          action: "added",
        },
      }),
    ),

    sendNotification({
      receiverId: serviceRequest.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_reassigned",
      room: `user:${serviceRequest.userId}`,
      event: "service-request:reassigned",
      data: {
        staffIds,
        status,
        recipientType: "user",
      },
    }),
  ]);
};