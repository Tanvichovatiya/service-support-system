"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ChatLayout from "@/components/chat/ChatLayout";
import { getMyrequestUser } from "@/axiosApi/msgApi";

import { setUsers } from "@/redux/slice/userSlice";

import {
  setSelectedContact,
  setMessages,
} from "@/redux/slice/chatSlice";

const StaffChatPage = () => {
  const dispatch = useDispatch();

  const fetchReqUser = async () => {
    try {
      const res = await getMyrequestUser();

      console.log("fetch users:", res);

      const usersData = Array.isArray(res)
        ? res
        : res?.data || [];

      dispatch(setUsers(usersData));
    } catch (error) {
      console.log("err:", error);
    }
  };

  useEffect(() => {
    fetchReqUser();

    dispatch(setSelectedContact(null));
    dispatch(setMessages([]));
  }, [dispatch]);

  return <ChatLayout contactType="users" />;
};

export default StaffChatPage;