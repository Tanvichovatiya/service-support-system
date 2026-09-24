import { auditLogServices } from "../services/auditLogServices.js";
import notificationServices from "../services/notificationServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";
import { userServices } from "../services/userServices.js";

const processPendingOverdueRequest = async () => {
  try {
    const overdueRequests =
      await ServiceRequestServices.getPendingOverdueRequests();

    console.log("Pending overdue request:", overdueRequests.length);

    if (overdueRequests.length === 0) {
      return {
        found: 0,
        processed: 0,
      };
    }

    const admin = await userServices.getdatabyfindOne(
      { role: "admin", isActive: true },
      "_id firstname lastname",
    );


    let processed = 0;

    for (const request of overdueRequests) {
      try {
        const overdueAt = new Date();

        const updatedRequest = await ServiceRequestServices.updateOne(
          {
            _id: request._id,
            status: "pending",
            isOverdue: false,
          },
          {
            $set: {
              isOverdue: true,
              overdueAt,
            },
          },
        );

        if (!updatedRequest) {
          continue;
        }

        const notification =
          await notificationServices.createNotification({
            receiverId: admin._id,
            type: "service_request_overdue",
            message: `Service request "${request.title}" has been pending for more than 24 hours.`,
            requestId: request._id,
            isRead: false,
          });

        await auditLogServices.create({
          userId: admin._id,
          action: "SERVICE_REQUEST_OVERDUE",
          entity: "ServiceRequest",
          entityId: request._id,
          oldValue: {
            status: "pending",
            isOverdue: false,
          },
          newValue: {
            status: "pending",
            isOverdue: true,
            overdueAt,
          },
          ipAddress: null,
          userAgent: "CRON_JOB",
        });

        processed++;

        console.log(`Overdue request processed: ${request._id}`);
        console.log(
          `Notification created: ${notification.notification._id}`,
        );
      } catch (error) {
        console.error(
          `Failed to process request ${request._id}:`,
          error,
        );
      }
    }

    return {
      found: overdueRequests.length,
      processed,
    };
  } catch (error) {
    console.log("Process pending overdue request:", error);
    throw error;
  }
};

export default processPendingOverdueRequest;