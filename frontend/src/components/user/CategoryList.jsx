"use client";

import { useCallback, useEffect, useState } from "react";
import { FiAlertCircle, FiFolder, FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getCategories } from "@/axiosApi/categoryApi";
import Pagination from "@/components/pagination";
import { setCategories } from "@/redux/slice/categorySlice";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react"
import { fadeLeft, fadeRight } from "../ui/Animation";

const CategoryList = () => {
  const dispatch = useDispatch();

  const {
    categories,
    page,
    limit,
    totalCategories,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.category);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(
    async (currentPage = 1) => {
      try {
        setLoading(true);
        setError("");


        const data = await getCategories(currentPage);

        dispatch(
          setCategories({
            categories: data.categories || [],
            page: data.page || currentPage,
            limit: data.limit || limit,
            totalCategories: data.totalCategories || 0,
            totalPages: data.totalPages || 0,
          })
        );
      } catch (error) {
        console.error("Fetch categories error:", error);

        setError(
          error?.response?.data?.message ||
          "Failed to load categories. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, limit]


  );

  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  const handlePageChange = (newPage) => {
    fetchCategories(newPage);
  };

  const handleRetry = () => {
    fetchCategories(page);
  };

  return (
    <section className="w-full">
      <div className="mb-6 mt-8">
        <motion.div variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2
          }}>
          <h2 className="text-xl font-semibold text-brand">Categories</h2>

          <p className="mt-1 text-sm text-text-secondary">
            Browse all available service categories.
          </p>
        </motion.div>
      </div>

      {error && !loading && (
        <div className="mb-6 rounded-admin border border-danger/20 bg-danger-light p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle
              className="mt-0.5 shrink-0 text-danger"
              size={20}
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-danger-dark">{error}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-3"
              >
                <FiRefreshCw size={14} className="mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-admin-lg bg-surface"
            >
              <div className="h-full rounded-admin-lg border border-border-light p-5">
                <div className="mb-4 h-10 w-10 rounded-admin bg-background-soft" />
                <div className="mb-3 h-5 w-3/4 rounded bg-background-soft" />
                <div className="mb-2 h-3 w-full rounded bg-background-soft" />
                <div className="h-3 w-5/6 rounded bg-background-soft" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="rounded-admin-lg border border-border bg-surface p-10 text-center shadow-admin-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <FiFolder size={22} />
          </div>

          <h3 className="text-base font-semibold text-text-primary">
            No categories found
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            There are no categories available at the moment.
          </p>
        </div>
      )}

      {/* {!loading && !error && categories.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <motion.article variants={fadeRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{
                        once: false,
                        amount: 0.2
                      }}
                key={category._id}
                className="group relative overflow-hidden rounded-admin-lg bg-accent-dark p-5 shadow-admin-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-admin"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-125" />

                <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-admin bg-white/15 text-white">
                  <FiFolder size={20} />
                </div>

                <h3 className="relative text-base font-semibold text-white">
                  {category.name}
                </h3>

                <p className="relative mt-2 line-clamp-3 text-sm leading-6 text-white/80">
                  {category.description}
                </p>
              </motion.article>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              total={totalCategories}
              limit={limit}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )} */}
      {!loading && !error && categories.length > 0 && (
        <> <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.article
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-admin-lg bg-accent-dark p-5 shadow-admin-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-admin"
            > <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-125" />


              <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-admin bg-white/15 text-white">
                <FiFolder size={20} />
              </div>

              <h3 className="relative text-base font-semibold text-white">
                {category.name}
              </h3>

              <p className="relative mt-2 line-clamp-3 text-sm leading-6 text-white/80">
                {category.description}
              </p>
            </motion.article>
          ))}
        </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              total={totalCategories}
              limit={limit}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}


        </>
      )}

    </section>


  );
};

export default CategoryList;
