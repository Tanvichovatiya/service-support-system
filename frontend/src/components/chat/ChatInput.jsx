
"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";

import { sendMsg } from "@/axiosApi/msgApi";
import { addMessage } from "@/redux/slice/chatSlice";

const ChatInput = () => {
  const dispatch = useDispatch();

  const { selectedContact } = useSelector(
    (state) => state.chat
  );

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);

  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedContact) {
      return;
    }

    if (!text.trim() && !file) {
      return;
    }


    const receiverId =
      selectedContact.userId || selectedContact._id;


    try {
      setSending(true);


      const newMessage = await sendMsg(
        receiverId,
        text.trim(),
        file
      );

      dispatch(addMessage(newMessage));

      setText("");
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      console.log("Chat send error:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
    shrink-0
    border-t
    border-border
    bg-surface
    p-2
    sm:p-4
  "
    >
      {file && (
        <div className="mb-2 flex items-center gap-2 px-1 text-xs text-text-muted">
          <span className="min-w-0 flex-1 truncate">
            {file.name}
          </span>

          <button
            type="button"
            onClick={() => {
              setFile(null);

              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="shrink-0 text-red-500"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex min-w-0 gap-2 sm:gap-3">

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            setFile(selectedFile || null);
          }}
        />

        <button
          type="button"
          disabled={sending}
          onClick={() => fileRef.current?.click()}
          className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-border
        text-text-muted
        transition
        hover:bg-surface-soft
        disabled:opacity-50
        sm:h-11
        sm:w-11
      "
        >
          <FaPaperclip size={14} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="
        h-10
        min-w-0
        flex-1
        rounded-xl
        border
        border-border
        bg-surface-soft
        px-3
        text-sm
        text-text-primary
        outline-none
        placeholder:text-text-muted
        focus:border-brand
        focus:ring-2
        focus:ring-brand/10
        sm:h-11
        sm:px-4
      "
        />

        <button
          type="submit"
          disabled={
            sending ||
            (!text.trim() && !file)
          }
          className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-brand
        text-white
        transition
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:h-11
        sm:w-11
      "
        >
          <FaPaperPlane size={13} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
