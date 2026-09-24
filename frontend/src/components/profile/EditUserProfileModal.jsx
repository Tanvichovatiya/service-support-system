
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";

import { InputField } from "@/components/ui/InputField";
import FileInput from "@/components/ui/FileInput";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

import { editUserProfile } from "@/axiosApi/userApi";

import {
  closeEditProfileModal,
  setUpdateLoading,
  updateProfile,
} from "@/redux/slice/profileSlice";

const EditUserProfileModal = () => {
  const dispatch = useDispatch();

  const {
    profile,
    updateLoading,
  } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
  });

  const [profileFile, setProfileFile] = useState(null);

  const [errors, setErrors] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Set existing profile data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!profile) return;

    setFormData({
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      gender: profile.gender || "",
    });
  }, [profile]);

  /*
  |--------------------------------------------------------------------------
  | Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    } else if (formData.firstname.trim().length < 2) {
      newErrors.firstname =
        "First name must be at least 2 characters";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname =
        "Last name must be at least 2 characters";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      dispatch(setUpdateLoading(true));

      const data = new FormData();

      data.append(
        "firstname",
        formData.firstname.trim()
      );

      data.append(
        "lastname",
        formData.lastname.trim()
      );

      data.append(
        "gender",
        formData.gender
      );

      if (profileFile) {
        data.append("profilePic", profileFile);
      }

      await editUserProfile(data);

      /*
       * Update Redux immediately.
       */
      dispatch(
        updateProfile({
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          gender: formData.gender,

          ...(profileFile && {
            profilePic: URL.createObjectURL(profileFile),
          }),
        })
      );

      dispatch(closeEditProfileModal());

    } catch (error) {
      console.log("Update profile error:", error);

      setErrors({
        submit:
          error?.response?.data?.message ||
          "Failed to update profile",
      });
    } finally {
      dispatch(setUpdateLoading(false));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    if (updateLoading) return;

    setErrors({});
    setProfileFile(null);

    dispatch(closeEditProfileModal());
  };

  if (!profile) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-overlay
        p-4
      "
      onMouseDown={handleClose}
    >
      <div
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-admin-xl
          border
          border-border
          bg-modal-background
          shadow-admin-lg
        "
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Edit Profile
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Update your personal information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={updateLoading}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-text-muted
              transition
              hover:bg-surface-soft
              hover:text-text-primary
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FaTimes size={17} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Profile Image */}
          <div className="flex flex-col items-center">

            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-brand-soft bg-surface-soft">

              {profileFile ? (
                <img
                  src={URL.createObjectURL(profileFile)}
                  alt="New profile"
                  className="h-full w-full object-cover"
                />
              ) : profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand">
                  <FaUser size={35} />
                </div>
              )}

            </div>

            <div className="w-full">
              <FileInput
                label="Profile Picture"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                file={profileFile}
                multiple={false}
                onChange={setProfileFile}
                helperText="PNG, JPG or WEBP. Choose a new image to update your profile picture."
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid gap-4 sm:grid-cols-2">

            <InputField
              label="First Name"
              id="firstname"
              name="firstname"
              placeholder="Enter first name"
              value={formData.firstname}
              onChange={handleChange}
              error={errors.firstname}
              required
              leftIcon={FaUser}
              disabled={updateLoading}
            />

            <InputField
              label="Last Name"
              id="lastname"
              name="lastname"
              placeholder="Enter last name"
              value={formData.lastname}
              onChange={handleChange}
              error={errors.lastname}
              required
              leftIcon={FaUser}
              disabled={updateLoading}
            />

          </div>

          {/* Gender */}
          <Select
            label="Gender"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            error={errors.gender}
            disabled={updateLoading}
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
            placeholder="Select gender"
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3">
              <p className="text-sm text-danger">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-border-light pt-5">

            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={updateLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={updateLoading}
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

export default EditUserProfileModal;