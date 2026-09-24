"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setNotifications,
    addNotification,
} from "@/redux/slice/notificationSlice";

import {
    addMessage,
    updateMessageReadStatus,
    incrementUnread,
} from "@/redux/slice/chatSlice";

import { socket } from "./socket";


export default function SocketProvider({ children }) {


    const handleNotification = (data) => {
        if (!data?.notification) return;

        dispatch(
            addNotification({
                notification: data.notification,
                unreadCount: data.unreadCount,
            }),
        );
    };
    const dispatch = useDispatch();

    const selectedContact = useSelector(
        (state) => state.chat.selectedContact
    );

    const selectedContactRef = useRef(null);

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            return;
        }

        socket.auth = {
            token,
        };

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
        };

        const handleDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
        };

        const handleReceiveMessage = (message) => {
            dispatch(addMessage(message));

            const messageSenderId = message.senderId;

            const currentContact = selectedContactRef.current;

            const selectedContactId =
                currentContact?.userId ||
                currentContact?._id ||
                currentContact?.id;

            const isCurrentChat =
                messageSenderId?.toString() ===
                selectedContactId?.toString();

            if (isCurrentChat) {
                socket.emit("message-seen", {
                    senderId: messageSenderId,
                });
            }

            dispatch(incrementUnread(messageSenderId));
        };

        const handleMessageSeen = (data) => {
            console.log("markMessageAsSeen:", data);

            dispatch(
                updateMessageReadStatus({
                    senderId: data?.senderId,
                    receiverId: data?.receiverId,
                })
            );
        };

        const handleRequestAssigned = (data) => {
            console.log("service-request:assigned", data);

            handleNotification(data);
        };

        const handleRequestStatusUpdated = (data) => {
            console.log("service-request:status-updated", data);

            handleNotification(data);
        };

        const handleCommentAdded = (data) => {
            console.log("service-request:comment-added", data);

            handleNotification(data);
        };

        const handleRequestRemoved = (data) => {
            console.log("service-request:removed", data);

            handleNotification(data);
        };

        const handleRequestReassigned = (data) => {
            console.log("service-request:reassigned", data);

            handleNotification(data);
        };

        socket.on("connect", handleConnect);

        socket.on("disconnect", handleDisconnect);

        socket.on("receive-message", handleReceiveMessage);

        socket.on("markMessageAsSeen", handleMessageSeen);

        socket.on("service-request:assigned", handleRequestAssigned);

        socket.on("service-request:status-updated", handleRequestStatusUpdated);

        socket.on("service-request:comment-added", handleCommentAdded);

        socket.on("service-request:removed", handleRequestRemoved);

        socket.on("service-request:reassigned", handleRequestReassigned);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);

            socket.off("disconnect", handleDisconnect);

            socket.off("receive-message", handleReceiveMessage);

            socket.off("markMessageAsSeen", handleMessageSeen);

            socket.off("service-request:assigned", handleRequestAssigned);

            socket.off("service-request:status-updated", handleRequestStatusUpdated);

            socket.off("service-request:comment-added", handleCommentAdded);

            socket.off("service-request:removed", handleRequestRemoved);

            socket.off("service-request:reassigned", handleRequestReassigned);

            socket.disconnect();
        };
    }, [dispatch]);

    return <>{children}</>;
}