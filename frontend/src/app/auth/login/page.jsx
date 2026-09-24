
"use client";

import LoginForm from "@/components/auth/LoginForm";
import LoginBranding from "@/components/auth/LoginBranding";



const LoginPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center">

        <div
          className="
            grid
            w-full
            overflow-hidden
            rounded-3xl
            border
            border-border
            bg-surface
            shadow-[0_20px_60px_rgba(74,47,32,0.12)]
            lg:grid-cols-2
          "
        >

          <LoginBranding />

          <section
            className="
              flex
              min-h-[680px]
              items-center
              justify-center
              p-6
              sm:p-10
              lg:p-12
            "
          >
            <LoginForm
            
              accountMessage="Don't have an account?"
              accountAction="Register"
            />
          </section>

        </div>
      </div>
    </main>
  );
};

export default LoginPage;
