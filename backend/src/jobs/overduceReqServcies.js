import { auditLogServices } from "../services/auditLogServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";
import { userServices } from "../services/userServices.js";
import { sendNotification } from "../utils/sendNotification.js";

const processPendingOverdueRequest = async () => {
  try {
    const overdueRequests =
      await ServiceRequestServices.getPendingOverdueRequests();

    console.log("Pending overdue requests:", overdueRequests.length);

    if (overdueRequests.length === 0) {
      return { found: 0, processed: 0 };
    }

    const admin = await userServices.getdatabyfindOne(
      { role: "admin" },
      "_id",
    );

    if (!admin) {
      throw new Error("Admin not found");
    }

    let processed = 0;

    for (const request of overdueRequests) {
      try {
        const overdueAt = new Date();

        const updatedRequest = await ServiceRequestServices.findOneAndUpdate(
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
          {
            new: true,
          },
        );

        if (!updatedRequest) {
          continue;
        }

        await sendNotification({
          receiverId: admin._id,
          requestId: request._id,
          type: "service_request_overdue",
          data: {
            recipientType: "admin",
          },
          room: "admins",
        });

        await sendNotification({
          receiverId: request.userId,
          requestId: request._id,
          type: "service_request_overdue",
          data: {
            recipientType: "user",
          },
          room: `user:${request.userId}`,
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
      } catch (error) {
        console.error(
          `Failed to process overdue request ${request._id}:`,
          error,
        );
      }
    }

    return {
      found: overdueRequests.length,
      processed,
    };
  } catch (error) {
    console.error("Process pending overdue request error:", error);
    throw error;
  }
};

export default processPendingOverdueRequest;