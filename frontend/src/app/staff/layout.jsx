import ProtectedRoute from "@/components/ProtectedRoute";
import SocketProvider from "@/socket/SocketProvider";
import StaffLayout from "@/components/staff/StaffLayout";


export default function Layout ({children}){
   return (
    <ProtectedRoute>
      <SocketProvider>
        <StaffLayout>
          {children}
        </StaffLayout>
        
      </SocketProvider>      
    </ProtectedRoute>
   )
}