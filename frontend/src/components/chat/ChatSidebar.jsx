"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";

import ChatUserItem from "./ChatUserItem";

const ChatSidebar = ({ contacts = [] }) => {
  const [search, setSearch] = useState("");

  const { unreadCounts } = useSelector((state) => state.chat);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const fullName =
        `${contact?.firstname || ""} ${
          contact?.lastname || ""
        }`.toLowerCase();

      return fullName.includes(search.toLowerCase());
    });
  }, [contacts, search]);

  return (
    <aside className="flex h-full w-full flex-col bg-accent-dark">

     
      <div className="shrink-0 border-b border-border px-4 py-4 sm:px-5">
        
        <div className="flex items-center gap-3">
          
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
            <FaComments size={16} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-brand-soft">
              Messages
            </h1>

            <p className="text-xs text-brand-soft">
              Your conversations
            </p>
          </div>
        </div>

       
        <div className="relative mt-4">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand"
            size={13}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-border
              bg-surface-soft
              pl-9
              pr-3
              text-sm
              text-text-primary
              outline-none
              placeholder:text-text-muted
              focus:border-brand
              focus:ring-2
              focus:ring-brand-dark
            "
          />
        </div>
      </div>

   
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-soft">
          Conversations
        </h2>

        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-brand">
          {filteredContacts.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const contactId = (
              contact?.userId ||
              contact?._id ||
              contact?.id
            )?.toString();

            const unread = unreadCounts?.[contactId] || 0;

            return (
              <ChatUserItem
                key={contactId}
                contact={{
                  ...contact,
                  unread,
                }}
              />
            );
          })
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-brand-soft">
              No conversations found.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;