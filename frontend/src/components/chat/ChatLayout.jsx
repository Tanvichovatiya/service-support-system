"use client";

import { useSelector } from "react-redux";

import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatLayout = ({ contactType }) => {
  
  const { staff, users } = useSelector((state) => state.user);
  const { selectedContact } = useSelector((state) => state.chat);

  const contacts = contactType === "staff" ? staff : users;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-page-background">
      
   
      <aside
        className={`
          h-full w-full shrink-0
          border-r border-border
          bg-surface

          md:w-[320px]
          lg:w-[350px]

          ${selectedContact ? "hidden md:flex" : "flex"}
        `}
      >
        <ChatSidebar contacts={contacts} />
      </aside>

     
      <main
        className={`
          min-w-0 flex-1 flex-col
          bg-brand-soft

          ${selectedContact ? "flex" : "hidden md:flex"}
        `}
      >
        {selectedContact ? (
          <>
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </>
        ) : (
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="px-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">
                💬
              </div>

              <h2 className="text-lg font-semibold text-text-primary">
                Select a conversation
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Choose someone from the list to start chatting.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatLayout;