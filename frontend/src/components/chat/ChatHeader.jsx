"use client";

import { FiArrowLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { clearSelectedContact } from "@/redux/slice/chatSlice";

const ChatHeader = () => {
  const dispatch = useDispatch();

  const { selectedContact } = useSelector(
    (state) => state.chat
  );

  if (!selectedContact) {
    return null;
  }

  const fullName = `
    ${selectedContact.firstname || ""}
    ${selectedContact.lastname || ""}
  `.trim();

  return (
    <header
      className="
        flex
        h-[64px]
        shrink-0
        items-center
        border-b
        border-border
        bg-brand
        px-3
        sm:h-[72px]
        sm:px-5
      "
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

      
        <button
          type="button"
          onClick={() => dispatch(clearSelectedContact())}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            text-brand-soft
            transition
            hover:bg-brand-soft
            hover:text-brand cursor-pointer
          "
          title="Back to chats"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={
              selectedContact.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName || "User"
              )}`
            }
            alt={fullName || "User"}
            className="
              h-10
              w-10
              rounded-full
              object-cover
              sm:h-11
              sm:w-11
            "
          />

          {selectedContact.isOnline && (
            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-surface
                bg-green-500
                sm:h-3
                sm:w-3
              "
            />
          )}
        </div>

        {/* User info */}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-brand-soft">
            {fullName}
          </h2>

          <p className="mt-0.5 text-xs">
            {selectedContact.isOnline ? (
              <span className="text-green-400">
                Online
              </span>
            ) : (
              <span className="text-brand-soft/70">
                Offline
              </span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;