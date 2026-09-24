import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    page: 1,
    limit: 10,
    totalNotification: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,

    reducers: {
        setNotifications: (state, action) => {
            const {
                notifications,
                page,
                limit,
                total,
                totalPages,
                unreadCount,
            } = action.payload;

            state.notifications = notifications || [];
            state.page = page || 1;
            state.limit = limit || 10;
            state.totalNotification = total || 0;
            state.totalPages = totalPages || 0;

            state.hasNextPage = state.page < state.totalPages;
            state.hasPrevPage = state.page > 1;

            if (unreadCount !== undefined && unreadCount !== null) {
                state.unreadCount = unreadCount;
            }
        },

        addNotification: (state, action) => {
            const { notification, unreadCount } = action.payload;

            if (!notification) return;

            const exists = state.notifications.some(
                (item) => item._id === notification._id
            );

            if (!exists) {
                state.notifications.unshift(notification);
            }

            if (unreadCount !== undefined && unreadCount !== null) {
                state.unreadCount = unreadCount;
            } else if (!notification.isRead) {
                state.unreadCount += 1;
            }

            state.totalNotification += 1;
        },

        markNotificationAsRead: (state, action) => {
            const { notificationId, unreadCount } = action.payload;

            const notification = state.notifications.find(
                (item) => item._id === notificationId
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;

                if (
                    unreadCount !== undefined &&
                    unreadCount !== null
                ) {
                    state.unreadCount = unreadCount;
                } else {
                    state.unreadCount = Math.max(
                        (state.unreadCount ?? 0) - 1,
                        0
                    );
                }
            }
        },

        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach((notification) => {
                notification.isRead = true;
            });

            state.unreadCount = 0;
        },

        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },

        resetNotifications: () => initialState,
    },
});

export const {
    setNotifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setUnreadCount,
    resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;