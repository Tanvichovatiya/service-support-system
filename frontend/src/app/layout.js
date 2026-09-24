"use client"

import "./globals.css";
import ReduxProvider from "@/redux/provider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function RootLayout({ children }) {
  return (
    <html
      lang="en">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
             {children}
             <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        </ReduxProvider>
       
        </body>
    </html>
  );
}
