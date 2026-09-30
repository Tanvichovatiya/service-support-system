
"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaUser, FaTools } from "react-icons/fa";
import { toast } from "react-toastify";

import { InputField } from "@/components/ui/InputField";
import FileInput from "@/components/ui/FileInput";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

import { editStaffProfile } from "@/axiosApi/userApi";

const EditStaffProfileModal = ({profile,onClose,onSuccess}) => {
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    department: "",
    skills: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      gender: profile.gender || "",
      department: profile.department || "",
      skills: Array.isArray(profile.skills)
        ? profile.skills.join(", ")
        : profile.skills || "",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const firstname = formData.firstname.trim();
    const lastname = formData.lastname.trim();

    if (!firstname) {
      setError("First name is required");
      return;
    }


    try {
      setLoading(true);

      const data = new FormData();

      data.append("firstname", firstname);
      data.append("lastname", lastname);
      data.append("gender", formData.gender);
      data.append(
        "department",
        formData.department.trim()
      );

      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      skills.forEach((skill) => {
        data.append("skills[]", skill);
      });

      if (profileFile) {
        data.append("profilePic", profileFile);
      }

      await editStaffProfile(data);

      toast.success("Profile updated successfully");

      await onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Update staff profile error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-admin-xl bg-modal-background shadow-admin-lg">
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Update your personal and staff information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close edit profile"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-soft hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Profile Picture
            </h3>

            <FileInput
              label="Choose new profile picture"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              file={profileFile}
              multiple={false}
              onChange={setProfileFile}
              helperText="JPG, PNG or WEBP"
              disabled={loading}
            />
          </section>

          <section className="mt-6">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="First Name"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                placeholder="Enter first name"
                onChange={handleChange}
                leftIcon={FaUser}
                required
                disabled={loading}
              />

              <InputField
                label="Last Name"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                placeholder="Enter last name"
                onChange={handleChange}
                leftIcon={FaUser}
                required
                disabled={loading}
              />
            </div>

            <div className="mt-4">
              <Select
                label="Gender"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Select gender"
                disabled={loading}
                options={[
                  {
                    value: "male",
                    label: "Male",
                  },
                  {
                    value: "female",
                    label: "Female",
                  },
                  {
                    value: "other",
                    label: "Other",
                  },
                ]}
              />
            </div>
          </section>

          <section className="mt-6">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Staff Information
            </h3>

            <div>
              <InputField
                label="Skills"
                id="skills"
                name="skills"
                value={formData.skills}
                placeholder="React, Node.js, MongoDB"
                onChange={handleChange}
                leftIcon={FaTools}
                disabled={loading}
              />

              <p className="mt-1.5 text-xs text-text-muted">
                Separate multiple skills with commas.
              </p>
            </div>
          </section>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffProfileModal;
