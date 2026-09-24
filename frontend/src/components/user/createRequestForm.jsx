"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa6";

import { createServiceRequest } from "@/axiosApi/serviceRequestApi";
import { getActiveCategories } from "@/axiosApi/categoryApi";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import FileInput from "../ui/FileInput";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";

import { setError, setLoading } from "@/redux/slice/authSlice";
import { setActiveCategories } from "@/redux/slice/categorySlice";
import { motion } from "motion/react"
import { fadeLeft } from "../ui/Animation";

const CreateRequestForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { activeCategories = [] } = useSelector(
    (state) => state.category
  );

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    priority: "medium",
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileResetKey, setFileResetKey] = useState(0);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);


        const result = await getActiveCategories();

        dispatch(
          setActiveCategories(
            result?.categories || result || []
          )
        );
      } catch (error) {
        console.error("Category fetch error:", error);

        dispatch(
          setError(
            error?.response?.data?.message ||
            "Failed to load categories"
          )
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();

    return () => {
      dispatch(setError(""));
      dispatch(setLoading(false));
    };


  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      dispatch(setError(""));
    }

  };

  const handleFileChange = (files) => {
    setAttachments(files || []);


    if (errors.attachments) {
      setErrors((prev) => ({
        ...prev,
        attachments: "",
      }));
    }

    if (error) {
      dispatch(setError(""));
    }


  };

  const handleClear = () => {
    setFormData({
      categoryId: "",
      title: "",
      description: "",
      priority: "medium",
    });


    setAttachments([]);
    setErrors({});

    dispatch(setError(""));
    setFileResetKey((prev) => prev + 1);

  };

  const validateForm = () => {
    const newErrors = {};


    if (!formData.categoryId.trim()) {
      newErrors.categoryId = "Please select a category";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title =
        "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;


  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    dispatch(setError(""));

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setLoading(true));

      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title.trim());
      data.append("description",formData.description.trim());
      data.append("priority", formData.priority);

      attachments.forEach((file) => {
        data.append("attachments", file);
      });

      const res = await createServiceRequest(data);

      toast.success(res?.message ||"Service request created successfully");

      handleClear();
      router.push("/user/requests/my");
    } catch (error) {
      console.error(
        "Create service request error:",
        error
      );

      dispatch(
        setError(
          error?.response?.data?.message ||
          "Failed to create service request"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }


  };

  const categoryOptions = activeCategories.map(
    (category) => ({
      value: category._id,
      label: category.name,
    })
  );

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "high",
      label: "High",
    },
    {
      value: "urgent",
      label: "Urgent",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        > <FaArrowLeft size={15} />
          Back to Requests </button> </div>


      <motion.div variants={fadeLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: false,
          amount: 0.2
        }} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-admin-lg" >
        <div className="border-b border-border px-6 py-6 sm:px-8">
          <h1 className="text-xl font-semibold text-text sm:text-2xl">
            Create Service Request
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Tell us about your issue and our support team
            will help you resolve it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8"
        >
          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <Select
            label="Category"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            options={categoryOptions}
            placeholder={
              categoriesLoading
                ? "Loading categories..."
                : "Select category"
            }
            required
            error={errors.categoryId}
            disabled={
              loading ||
              categoriesLoading ||
              categoryOptions.length === 0
            }
          />

          {!categoriesLoading &&
            categoryOptions.length === 0 && (
              <p className="text-sm text-warning">
                No active categories are available.
              </p>
            )}

          <InputField
            label="Title"
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Internet connection is not working"
            value={formData.title}
            onChange={handleChange}
            required
            error={errors.title}
            disabled={loading}
            maxLength={200}
          />

          <TextArea
            label="Description"
            id="description"
            name="description"
            placeholder="Describe your issue in detail..."
            value={formData.description}
            onChange={handleChange}
            rows={7}
            required
            error={errors.description}
            disabled={loading}
          />

          <Select
            label="Priority"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
            placeholder="Select priority"
            required
            disabled={loading}
          />

          <FileInput
            label="Attachments"
            accept="image/*,.pdf,.doc,.docx"
            file={attachments}
            multiple
            disabled={loading}
            onChange={handleFileChange}
            helperText="You can upload multiple images or documents."
            resetKey={fileResetKey}
          />

          {errors.attachments && (
            <p className="text-sm text-danger">
              {errors.attachments}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={
                loading ||
                categoriesLoading ||
                categoryOptions.length === 0
              }
              className="w-full sm:w-auto"
            >
              {loading ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </motion.div >
    </div >

  );
};

export default CreateRequestForm;
