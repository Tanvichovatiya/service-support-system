"use client";

import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import { loadMessages } from "@/axiosApi/msgApi";

import {setMessages,setLoadingMessages,clearMessages,setCurUser} from "@/redux/slice/chatSlice";


import ChatMessage from "./ChatMessage";

const ChatMessages = () => {

  const dispatch = useDispatch();

  const {
    selectedContact,
    messages,
    loadingMessages,
  } = useSelector((state) => state.chat);

  const receiverId =
    selectedContact?.userId ||
    selectedContact?._id ||
    selectedContact?.id;

  useEffect(() => {
    if (!receiverId) {
      dispatch(clearMessages());
      dispatch(setCurUser(null));
      return;
    }

    const fetchMessages = async () => {
      try {
        dispatch(setLoadingMessages(true));
        dispatch(clearMessages());

        const data = await loadMessages(receiverId);
        dispatch(setMessages(data?.messages));

       
        dispatch(setCurUser(data?.curuser || null)

        );
      } catch (error) {
        console.error(
          "Load messages error:",
          error
        );

        dispatch(setMessages([]));
        dispatch(setCurUser(null));
      } finally {
        dispatch(
          setLoadingMessages(false)
        );
      }
    };

    fetchMessages();
  }, [receiverId, dispatch]);

  if (!selectedContact) {
    return (
      <div className="flex h-full items-center justify-center text-text-muted">
        Select a staff member to start chatting
      </div>
    );
  }

  if (loadingMessages) {
    return (
      <div className="flex h-full items-center justify-center text-text-muted">
        Loading messages...
      </div>
    );
  }
 
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-2 p-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center text-text-muted">
            No messages yet
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatMessages;