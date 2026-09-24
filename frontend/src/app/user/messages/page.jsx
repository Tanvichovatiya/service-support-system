"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ChatLayout from "@/components/chat/ChatLayout";
import { getMyRequestStaff } from "@/axiosApi/msgApi";
import { setStaff } from "@/redux/slice/userSlice";
import {
  setSelectedContact,
  setMessages,
} from "@/redux/slice/chatSlice";

const UserChatPage = () => {
  const dispatch = useDispatch();

  const fetchReqStaff = async () => {
    try {
      const res = await getMyRequestStaff();

      console.log("fetch staff:", res);

      const staffData = Array.isArray(res)
        ? res
        : res?.data || [];

      dispatch(setStaff(staffData));
    } catch (error) {
      console.log("err:", error);
    }
  };

  useEffect(() => {
    fetchReqStaff();

    // Optional: reset chat when entering page
    dispatch(setSelectedContact(null));
    dispatch(setMessages([]));
  }, [dispatch]);

  return <ChatLayout contactType="staff" />;
};

export default UserChatPage;