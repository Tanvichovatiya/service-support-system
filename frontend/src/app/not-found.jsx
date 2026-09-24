"use client";

import Link from "next/link";
import {
  FaArrowLeft,
  FaHouse,
  FaMagnifyingGlass,
  FaTriangleExclamation,
} from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10">
     

      <div
        className="pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-brand/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-32
          h-96
          w-96
          rounded-full
          bg-accent/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-brand/5
        "
      />


      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-3"
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-brand
              text-white
              shadow-sm
            "
          >
            <FaHouse size={18} />
          </div>

          <span
            className="
              font-serif
              text-xl
              font-bold
              text-text-primary
            "
          >
            Service
            <span className="text-accent">
              Hub
            </span>
          </span>
        </Link>

       
        <div className="relative mx-auto mb-8 w-fit">
        
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-40
              w-40
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-surface-soft
            "
          />

          {/* 404 */}
          <h1
            className="
              relative
              font-serif
              text-[120px]
              font-bold
              leading-none
              tracking-tight
              text-brand
              sm:text-[150px]
            "
          >
            404
          </h1>

          {/* Warning icon */}
          <div
            className="
              absolute
              -right-3
              top-0
              flex
              h-11
              w-11
              rotate-12
              items-center
              justify-center
              rounded-xl
              bg-accent
              text-white
              shadow-md
              sm:-right-5
            "
          >
            <FaTriangleExclamation size={20} />
          </div>
        </div>

        {/* Heading */}
        <h2
          className="
            font-serif
            text-2xl
            font-bold
            text-text-primary
            sm:text-3xl
          "
        >
          Page not found
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-3
            max-w-md
            text-sm
            leading-6
            text-text-secondary
            sm:text-base
          "
        >
          Sorry, we couldn't find the page you're
          looking for. It may have been moved,
          deleted, or the URL might be incorrect.
        </p>

      
        <div
          className="
            mt-7
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >
          {/* Go Home
          <Link
            href="/"
            className="
              inline-flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-brand
              px-5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-brand-dark
              focus:outline-none
              focus:ring-2
              focus:ring-brand
              focus:ring-offset-2
              sm:w-auto
            "
          >
            <FaHouse size={14} />

            Go Back
          </Link> */}

          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="
             cursor-pointer inline-flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-brand
              px-5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-brand-dark
              focus:outline-none
              focus:ring-2
              focus:ring-brand
              focus:ring-offset-2
              sm:w-auto
            "
          >
            <FaArrowLeft size={14} />

            Go Back
          </button>
        </div>

        {/* Help */}
        <p
          className="
            mt-8
            text-xs
            text-text-muted
          "
        >
          If you believe this is an error, please
          contact our support team.
        </p>
      </div>
    </main>
  );
}