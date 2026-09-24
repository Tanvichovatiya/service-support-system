"use client";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Button } from "@/components/ui/Button"

const Pagination = ({
  currentPage,
  total,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  limit,
}) => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">

   
      <p className="text-sm text-brand">
        Total:{" "}
        <span className="font-semibold text-brand">
          {total}
        </span>
      </p>

      <div className="flex items-center gap-2">

      
        <Button
          disabled={!hasPrevPage}
          onClick={() => {
            if (hasPrevPage) {
              onPageChange(currentPage - 1);
            }
          }}
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-admin
            border
            transition-all
            duration-200
            ${
              hasPrevPage
                ? `
                  border-border
                
                  text-brand
                  cursor-pointer
                  hover:bg-brand
                  hover:text-white
                  hover:shadow-admin-sm
                `
                : `
                  border-border-light
                  bg-background-soft
                  text-text-light
                  cursor-not-allowed
                `
            }
          `}
        >
          <FaAngleLeft size={14} />
        </Button>

      
        <div className="flex items-center gap-1.5">

          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                h-10
                min-w-10
                px-3
                rounded-admin
                border
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  currentPage === page
                    ? ` border-2
                      border-brand
                      bg-brand-light
                      text-white
                      shadow-admin-sm
                    `
                    : `
                      border-border
                      bg-brand
                      text-brand
                      cursor-pointer
                      hover:border-brand-light
                    
                    `
                }
              `}
            >
              {page}
            </Button>
          ))}

        </div>

        <Button
          disabled={!hasNextPage}
          onClick={() => {
            if (hasNextPage) {
              onPageChange(currentPage + 1);
            }
          }}
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-admin
            border
            transition-all
            duration-200
            ${
              hasNextPage
                ? `
                  border-border
              
                  text-brand
                  cursor-pointer
                  hover:bg-brand
                  hover:text-white
                  hover:shadow-admin-sm
                `
                : `
                  border-border-light
                  bg-background-soft
                  text-text-light
                  cursor-not-allowed
                `
            }
          `}
        >
          <FaAngleRight size={14} />
        </Button>

      </div>
    </div>
  );
};

export default Pagination;