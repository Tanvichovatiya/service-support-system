"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUser,
  FaIdBadge,
  FaBuilding,
  FaTools,
  FaEnvelope,
  FaCheckCircle,
  FaCircle,
  FaEdit,
} from "react-icons/fa";

import { setStaff } from "@/redux/slice/userSlice";
import { Button } from "@/components/ui/Button";
import EditStaffProfileModal from "@/components/profile/EditStaffProfileModal";
import { getStaffProfile } from "@/axiosApi/userApi";
import { setError, setLoading } from "@/redux/slice/authSlice";

const Page = () => {
  const dispatch = useDispatch();

  const {staff ,loadProfile}= useSelector(
    (state) => state.user
  );

  const {loading,error} = useSelector((state)=>state.auth)

  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfile = async () => {
    try {
      dispatch(setError(""));

      const data = await getStaffProfile();

      dispatch(setStaff(data));
    } catch (err) {
      console.log("Get staff profile error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      dispatch(setLoading(false))
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(()=>{
    fetchProfile();
  },[loadProfile])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-text-secondary">
          <span
            className="
              h-5 w-5
              animate-spin
              rounded-full
              border-2
              border-brand/30
              border-t-brand
            "
          />

          <span className="text-sm">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div
          className="
            rounded-admin
            border border-danger/20
            bg-danger-light
            px-5 py-4
            text-sm text-danger
          "
        >
          {error}
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div
          className="
            rounded-admin
            border border-border
            bg-surface
            p-8
            text-center
          "
        >
          <p className="text-text-secondary">
            Staff profile not found.
          </p>
        </div>
      </div>
    );
  }

  const fullName =
    `${staff.firstname || ""} ${staff.lastname || ""}`.trim();

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div
            className="
              mb-6
              flex flex-col gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-sm font-medium text-brand">
                Staff Account
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-semibold
                  text-text-primary
                "
              >
                My Profile
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                View and manage your staff profile information.
              </p>
            </div>

            <Button
              onClick={() => setShowEditModal(true)}
              className="w-full sm:w-auto"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Card */}
          <section
            className="
              overflow-hidden
              rounded-admin-xl
              border border-border
              bg-surface
              shadow-admin-sm
            "
          >
            {/* Profile top section */}
            <div
              className="
                border-b border-border
                bg-surface-soft
                px-5 py-6
                sm:px-8
              "
            >
              <div
                className="
                  flex flex-col gap-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="
                      h-20 w-20
                      shrink-0
                      overflow-hidden
                      rounded-full
                      bg-brand-soft
                      ring-4
                      ring-surface
                    "
                  >
                    {staff.profilePic ? (
                      <img
                        src={staff.profilePic}
                        alt={fullName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex h-full w-full
                          items-center justify-center
                          text-2xl
                          font-semibold
                          text-brand
                        "
                      >
                        {staff.firstname
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h2
                      className="
                        text-xl
                        font-semibold
                        text-text-primary
                      "
                    >
                      {fullName || "Staff Member"}
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      {staff.department || "Staff"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`
                          h-2.5 w-2.5 rounded-full
                          ${
                            staff.isOnline
                              ? "bg-success"
                              : "bg-text-light"
                          }
                        `}
                      />

                      <span className="text-xs text-text-secondary">
                        {staff.isOnline
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account status */}
                <div>
                  {staff.isActive ? (
                    <span
                      className="
                        inline-flex
                        items-center gap-1.5
                        rounded-full
                        bg-success-light
                        px-3 py-1.5
                        text-xs
                        font-medium
                        text-success-dark
                      "
                    >
                      <FaCheckCircle />
                      Active
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center gap-1.5
                        rounded-full
                        bg-danger-light
                        px-3 py-1.5
                        text-xs
                        font-medium
                        text-danger-dark
                      "
                    >
                      <FaCircle />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="p-5 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Personal information */}
                <div>
                  <h3
                    className="
                      mb-4
                      text-base
                      font-semibold
                      text-text-primary
                    "
                  >
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <ProfileItem
                      icon={FaUser}
                      label="Full Name"
                      value={fullName || "Not provided"}
                    />

                    <ProfileItem
                      icon={FaUser}
                      label="Gender"
                      value={
                        staff.gender
                          ? capitalize(staff.gender)
                          : "Not provided"
                      }
                    />

                    <ProfileItem
                      icon={FaEnvelope}
                      label="Email Verification"
                      value={
                        staff.isEmailVerified
                          ? "Verified"
                          : "Not verified"
                      }
                      valueClass={
                        staff.isEmailVerified
                          ? "text-success-dark"
                          : "text-warning-dark"
                      }
                    />
                  </div>
                </div>

                {/* Staff information */}
                <div>
                  <h3
                    className="
                      mb-4
                      text-base
                      font-semibold
                      text-text-primary
                    "
                  >
                    Staff Information
                  </h3>

                  <div className="space-y-4">
                    <ProfileItem
                      icon={FaIdBadge}
                      label="Employee ID"
                      value={
                        staff.employeeId ||
                        "Not provided"
                      }
                    />

                    <ProfileItem
                      icon={FaBuilding}
                      label="Department"
                      value={
                        staff.department ||
                        "Not provided"
                      }
                    />

                    <div
                      className="
                        flex gap-3
                        rounded-admin
                        border border-border-light
                        bg-surface-soft
                        p-4
                      "
                    >
                      <div
                        className="
                          flex h-9 w-9
                          shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-brand-soft
                          text-brand
                        "
                      >
                        <FaTools size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted">
                          Skills
                        </p>

                        {staff.skills?.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {staff.skills.map(
                              (skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="
                                    rounded-full
                                    bg-brand-soft
                                    px-2.5 py-1
                                    text-xs
                                    font-medium
                                    text-brand
                                  "
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-text-primary">
                            No skills added
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

  
      {showEditModal && (
        <EditStaffProfileModal
          profile={staff}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchProfile}
        />
      )}
    </>
  );
};

const ProfileItem = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-text-primary",
}) => {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-admin
        border border-border-light
        bg-surface-soft
        p-4
      "
    >
      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-lg
          bg-brand-soft
          text-brand
        "
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-text-muted">
          {label}
        </p>

        <p
          className={`
            mt-0.5
            truncate
            text-sm
            font-medium
            ${valueClass}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const capitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default Page;