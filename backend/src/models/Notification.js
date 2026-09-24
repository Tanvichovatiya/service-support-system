import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "new_request",
        "request_assigned",
        "status_changed",
        "new_comment",
        "new_message",
        "request_completed",
        "admin_update",
        "request_reassigned",
        "service_request_overdue"
      ],
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;