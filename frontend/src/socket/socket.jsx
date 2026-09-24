import { io } from "socket.io-client";


const socketUrl = process.env.NEXT_PUBLIC_API || "http://localhost:4000";


export const socket = io(socketUrl,{
  autoConnect:false
})