import notificationServices from "../services/notificationServices.js";

export const createAndSendNotification = async ({
  receiverId,
  senderId = null,
  requestId = null,
  type,
  message,
  actions = [],
  room,
  event = "notification:new",
}) => {
  
  const notification = await notificationServices.createNotification({
    receiverId,
    senderId,
    requestId,
    type,
    message,
    actions,
    isRead: false,
  });

 
  const key = `notifications:unread:${receiverId}`;

  const unreadCount = await redis.incr(key);

  // 3. Socket.IO
  const io = getIo();

  if (room) {
    io.to(room).emit(event, {
      notification,
      unreadCount,
    });
  }

  return {
    notification,
    unreadCount,
  };
};
