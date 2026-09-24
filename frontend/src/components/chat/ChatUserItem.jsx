
"use client";

import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

import { setSelectedContact, clearUnread } from "@/redux/slice/chatSlice";

const getContactId = (contact) => {
  return (contact?.userId || contact?._id || contact?.id)?.toString();
};

const ChatUserItem = ({ contact }) => {
  const dispatch = useDispatch();

  const { selectedContact, unreadCounts } = useSelector(
    (state) => state.chat
  );

  const contactId = getContactId(contact);
  const selectedId = getContactId(selectedContact);

  const isSelected = contactId === selectedId;
  const unreadCount = unreadCounts?.[contactId] || 0;

  const fullName =
    `${contact?.firstname || ""} ${contact?.lastname || ""}`.trim() || "User";

  const avatarUrl =
    contact?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E3EFF0&color=40595A&bold=true`;

  const handleSelect = () => {
    if (!contactId) {
      return;
    }

    dispatch(setSelectedContact(contact));

    if (unreadCount > 0) {
      dispatch(clearUnread(contactId));
    }
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`group flex w-full items-center gap-3 rounded-admin-lg px-3 py-3 text-left transition-all duration-200 ${isSelected ? "bg-brand-soft shadow-admin-sm" : "hover:bg-surface-soft"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={avatarUrl}
          alt={fullName}
          className="h-11 w-11 rounded-full border border-border object-cover"
        />

        {contact?.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-success" />
        )}
      </div>

      {/* Contact Information */}
      <div className="min-w-0 flex-1">
        {/* Name + Time */}
        <div className="flex items-center justify-between gap-2">
          <h3 className={`truncate text-sm font-semibold ${isSelected ? "text-brand" : "text-text-primary"}`}>
            {fullName}
          </h3>

          {contact?.time && (
            <span className={`shrink-0 text-[10px] ${unreadCount > 0 ? "font-semibold text-brand" : "text-text-muted"}`}>
              {contact.time}
            </span>
          )}
        </div>

        {/* Last Message + Unread */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className={`truncate text-xs ${unreadCount > 0 ? "font-medium text-text-primary" : "text-text-secondary"}`}>
            {contact?.lastMessage || "Start a conversation"}
          </p>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white shadow-admin-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <FaCheck size={9} />
        </div>
      )}
    </button>
  );
};

export default ChatUserItem;
