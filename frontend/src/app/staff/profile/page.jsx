
"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaIdBadge,
  FaBuilding,
  FaTools,
  FaEdit,
} from "react-icons/fa";

import { setStaff } from "@/redux/slice/userSlice";
import { setError, setLoading } from "@/redux/slice/authSlice";

import { getStaffProfile } from "@/axiosApi/userApi";

import { Button } from "@/components/ui/Button";
import ProfileItem from "@/components/profile/ProfileItem";
import EditStaffProfileModal from "@/components/profile/EditStaffProfileModal";
import {motion} from "motion/react"
import { fadeLeft } from "@/components/ui/Animation";

const StaffProfile = () => {
  const dispatch = useDispatch();

  const { staff, loadProfile } = useSelector(
    (state) => state.user
  );

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      dispatch(setError(""));
      dispatch(setLoading(true));

      const data = await getStaffProfile();

      dispatch(setStaff(data));
    } catch (error) {
      console.error("Get staff profile error:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
            "Failed to load profile"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, loadProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-text-secondary">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />

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
        <div className="rounded-admin border border-danger/20 bg-danger-light px-5 py-4 text-sm text-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-admin border border-border bg-surface p-8 text-center">
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
        <div  className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <motion.div variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: false,
                  amount: 0.2
                }}>
              <p className="text-sm font-medium text-brand">
                Staff Account
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-text-primary">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                View and manage your staff profile information.
              </p>
            </motion.div>

            <Button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="w-full sm:w-auto"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </Button>
          </div>

          <motion.section variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: false,
                  amount: 0.2
                }} className="overflow-hidden rounded-admin-xl border border-border bg-surface shadow-admin-sm">
            <div className="border-b border-border bg-surface-soft px-5 py-6 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-brand-soft ring-4 ring-surface">
                    {staff.profilePic ? (
                      <img
                        src={staff.profilePic}
                        alt={fullName || "Staff profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-brand">
                        {staff.firstname
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      {fullName || "Staff Member"}
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      {staff.department || "Staff"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          staff.isOnline
                            ? "bg-success"
                            : "bg-text-light"
                        }`}
                      />

                      <span className="text-xs text-text-secondary">
                        {staff.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <section>
                  <h3 className="mb-4 text-base font-semibold text-text-primary">
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
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-base font-semibold text-text-primary">
                    Staff Information
                  </h3>

                  <div className="space-y-4">
                    <ProfileItem
                      icon={FaIdBadge}
                      label="Employee ID"
                      value={
                        staff.employeeId || "Not provided"
                      }
                    />

                    <ProfileItem
                      icon={FaBuilding}
                      label="Department"
                      value={
                        staff.department || "Not provided"
                      }
                    />

                    <ProfileItem
                      icon={FaTools}
                      label="Skills"
                    >
                      {staff.skills?.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {staff.skills.map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-text-primary">
                          No skills added
                        </p>
                      )}
                    </ProfileItem>
                  </div>
                </section>
              </div>
            </div>
          </motion.section>
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

const capitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default StaffProfile;