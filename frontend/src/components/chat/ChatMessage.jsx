"use client";

import { useSelector } from "react-redux";
import { FaCheckDouble } from "react-icons/fa";

import MessageAttachment from "./MessageAttachment";

const getUserId = (user) => {
  if (!user) return null;

  return (
    user._id ||
    user.id ||
    user
  )?.toString();
};

const ChatMessage = ({ message }) => {
  const curUser = useSelector(
    (state) => state.chat.curUser
  );

  const currentUserId = getUserId(curUser);

  const senderId = getUserId(
    message?.senderId
  );

  const isMine =
    senderId === currentUserId;

  const time = message?.createdAt
    ? new Date(
        message.createdAt
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const attachments = Array.isArray(
    message?.attachments
  )
    ? message.attachments
    : message?.attachments
      ? [message.attachments]
      : [];

  return (
    <div
      className={`flex w-full ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          min-w-[70px]
          max-w-[75%]
          rounded-2xl
          px-3.5
          py-2
          shadow-sm
          ${
            isMine
              ? "rounded-br-md bg-brand text-white"
              : "rounded-bl-md border border-border bg-surface text-text-primary"
          }
        `}
      >
        {/* TEXT */}

        {message?.message && (
          <p className="break-words whitespace-pre-wrap text-sm">
            {message.message}
          </p>
        )}

        {/* ATTACHMENTS */}

        {attachments.length > 0 && (
          <div
            className={`flex flex-col gap-2 ${
              message?.message
                ? "mt-2"
                : ""
            }`}
          >
            {attachments.map(
              (attachment) => (
                <MessageAttachment
                  key={attachment._id}
                  attachment={attachment}
                />
              )
            )}
          </div>
        )}

        {/* TIME + READ STATUS */}

        <div
          className={`
            mt-1
            flex
            items-center
            justify-end
            gap-1
            text-[10px]
            ${
              isMine
                ? "text-white/70"
                : "text-text-muted"
            }
          `}
        >
          <span>{time}</span>

          {isMine && (
            <FaCheckDouble
              size={11}
              className={
                message?.isRead
                  ? "text-blue-300"
                  : "text-white/70"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;