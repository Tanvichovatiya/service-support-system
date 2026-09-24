import ProtectedRoute from "@/components/ProtectedRoute";
import UserLayout from "@/components/user/UserLayout";

import SocketProvider from "@/socket/SocketProvider";




export default function layout  ({children}) {
  return (

    <ProtectedRoute>
      <SocketProvider>
        <UserLayout>
           {children}
        </UserLayout>
         
      </SocketProvider>
    </ProtectedRoute>
  )
}