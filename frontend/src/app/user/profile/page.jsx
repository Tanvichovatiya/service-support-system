"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaVenusMars,
  FaEdit,
} from "react-icons/fa";

import { getUserProfile } from "@/axiosApi/userApi";

import {
  setProfile,
  setProfileLoading,
  setProfileError,
  openEditProfileModal,
} from "@/redux/slice/profileSlice";

import EditUserProfileModal from "@/components/profile/EditUserProfileModal";
import { Button } from "@/components/ui/Button";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    isEditModalOpen,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(setProfileLoading(true));

        const data = await getUserProfile();

        dispatch(setProfile(data));
      } catch (error) {
        console.log("Profile error:", error);

        dispatch(
          setProfileError(
            error?.response?.data?.message ||
              "Failed to load profile"
          )
        );
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-muted border-t-brand" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-text-secondary">
          Profile not found
        </p>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-primary">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Manage your personal profile information
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-admin-xl border border-border bg-surface shadow-admin">

            {/* Top Section */}
            <div className="bg-brand px-6 py-8 sm:px-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row">

                {/* Profile Image */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/30 bg-brand-light shadow-admin-md">
                  {profile.profilePic ? (
                    <img
                      src={profile.profilePic}
                      alt={`${profile.firstname || ""} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <FaUser size={42} />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold text-white">
                    {profile.firstname} {profile.lastname}
                  </h2>

                  <p className="mt-1 text-sm text-brand-soft">
                    User Profile
                  </p>
                </div>

              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    Your account information
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openEditProfileModal())
                  }
                >
                  <FaEdit className="mr-2" size={13} />
                  Edit Profile
                </Button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* First Name */}
                <div className="rounded-admin border border-border-light bg-surface-soft p-4">
                  <div className="mb-2 flex items-center gap-2 text-text-muted">
                    <FaUser size={14} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      First Name
                    </span>
                  </div>

                  <p className="text-sm font-medium text-text-primary">
                    {profile.firstname || "Not provided"}
                  </p>
                </div>

                {/* Last Name */}
                <div className="rounded-admin border border-border-light bg-surface-soft p-4">
                  <div className="mb-2 flex items-center gap-2 text-text-muted">
                    <FaUser size={14} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Last Name
                    </span>
                  </div>

                  <p className="text-sm font-medium text-text-primary">
                    {profile.lastname || "Not provided"}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-admin border border-border-light bg-surface-soft p-4">
                  <div className="mb-2 flex items-center gap-2 text-text-muted">
                    <FaEnvelope size={14} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Email
                    </span>
                  </div>

                  <p className="break-all text-sm font-medium text-text-primary">
                    {profile.email || "Not provided"}
                  </p>
                </div>

                {/* Gender */}
                <div className="rounded-admin border border-border-light bg-surface-soft p-4">
                  <div className="mb-2 flex items-center gap-2 text-text-muted">
                    <FaVenusMars size={14} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Gender
                    </span>
                  </div>

                  <p className="text-sm font-medium capitalize text-text-primary">
                    {profile.gender || "Not provided"}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isEditModalOpen && <EditUserProfileModal />}
    </>
  );
};

export default ProfilePage;