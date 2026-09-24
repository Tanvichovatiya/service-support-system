console.log("reassign.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reassignStaffModal");
    const form = document.getElementById("reassignStaffForm");
    const closeBtn = document.getElementById("closeReassignStaffModal");
    const cancelBtn = document.getElementById("cancelReassignStaff");
    const requestIdInput = document.getElementById("reassignRequestId");
    const requestTitle = document.getElementById("reassignRequestTitle");
    const currentStaffName = document.getElementById("currentStaffName");
    const currentStaffEmail = document.getElementById("currentStaffEmail");
    const staffSelect = document.getElementById("reassignStaffSelect");
    const staffError = document.getElementById("reassignStaffError");
    const loading = document.getElementById("reassignStaffLoading");
    const submitBtn = document.getElementById("reassignStaffSubmit");
    const submitIcon = document.getElementById("reassignStaffSubmitIcon");
    const submitText = document.getElementById("reassignStaffSubmitText");

    let currentStaffId = null;

    document.addEventListener("click", async (event) => {
        const button = event.target.closest(".reassign-staff-btn");

        if (!button) return;

        const requestId = button.dataset.id;

        if (!requestId) {
            console.error("Request ID is missing");
            return;
        }

        await openReassignModal(requestId);
    });

    async function openReassignModal(requestId) {
        resetModal();

        requestIdInput.value = requestId;
        showModal();
        setLoading(true);

        try {
            const [requestResponse, staffResponse] = await Promise.all([
                fetch(`/admin/servicerequest/${requestId}/data`),
                fetch("/admin/staff/active"),
            ]);

            if (!requestResponse.ok) {
                throw new Error("Failed to load service request");
            }

            if (!staffResponse.ok) {
                throw new Error("Failed to load active staff");
            }

            const requestResult = await requestResponse.json();
            const staffResult = await staffResponse.json();

            console.log("Request result:", requestResult);
            console.log("Staff result:", staffResult);

            const request = requestResult.data;
            const staffList = staffResult.data || [];

            if (!request) {
                throw new Error("Service request data not found");
            }

            currentStaffId = request.assignedStaff?._id || null;

            requestTitle.textContent = request.title || "Service Request";

            if (request.assignedStaff) {
                currentStaffName.textContent = getStaffName(
                    request.assignedStaff
                );

                currentStaffEmail.textContent =
                    request.assignedStaff.user?.email || "-";
            } else {
                currentStaffName.textContent = "No staff assigned";
                currentStaffEmail.textContent = "-";
            }

            populateStaffSelect(staffList, currentStaffId);
        } catch (error) {
            console.error("Reassign modal error:", error);

            showStaffError(
                error.message || "Unable to load staff information."
            );
        } finally {
            setLoading(false);
        }
    }

    function populateStaffSelect(staffList, assignedStaffId) {
        staffSelect.innerHTML =
            '<option value="">Select new staff member</option>';

        staffList.forEach((staff) => {
            const staffId = staff._id;

            if (!staffId) return;

            if (
                assignedStaffId &&
                String(staffId) === String(assignedStaffId)
            ) {
                return;
            }

            const option = document.createElement("option");

            option.value = staffId;
            option.textContent = getStaffName(staff);

            if (staff.staffUser?.email) {
                option.textContent += ` - ${staff.staffUser.email}`;
            }

            staffSelect.appendChild(option);
        });

        if (staffSelect.options.length === 1) {
            const option = document.createElement("option");

            option.value = "";
            option.disabled = true;
            option.textContent = "No other active staff available";

            staffSelect.appendChild(option);
        }
    }

    function getStaffName(staff) {
        const user = staff.staffUser || staff.user || staff;

        const firstName = user.firstname || user.firstName || "";
        const lastName = user.lastname || user.lastName || "";

        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || user.name || user.email || "Staff Member";
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearError();

        const requestId = requestIdInput.value;
        const newStaffId = staffSelect.value;

        if (!newStaffId) {
            showStaffError("Please select a staff member.");
            staffSelect.focus();
            return;
        }

        if (
            currentStaffId &&
            String(newStaffId) === String(currentStaffId)
        ) {
            showStaffError("Please select a different staff member.");
            staffSelect.focus();
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                `/admin/servicerequest/reassign/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        staffId: newStaffId,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to reassign staff."
                );
            }

            closeModal();

            showSuccess(
                result.message || "Staff reassigned successfully."
            );

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Reassign staff error:", error);

            showStaffError(
                error.message || "Failed to reassign staff."
            );
        } finally {
            setSubmitting(false);
        }
    });

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {
            closeModal();
        }
    });

    function showModal() {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");

        resetModal();
    }

    function resetModal() {
        form.reset();

        requestIdInput.value = "";
        requestTitle.textContent = "Service Request";
        currentStaffName.textContent = "-";
        currentStaffEmail.textContent = "-";

        staffSelect.innerHTML =
            '<option value="">Select new staff member</option>';

        currentStaffId = null;

        clearError();
        setLoading(false);
        setSubmitting(false);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loading.classList.remove("hidden");
            loading.classList.add("flex");

            form.classList.add("hidden");

            submitBtn.disabled = true;
        } else {
            loading.classList.add("hidden");
            loading.classList.remove("flex");

            form.classList.remove("hidden");

            submitBtn.disabled = false;
        }
    }

    function setSubmitting(isSubmitting) {
        submitBtn.disabled = isSubmitting;

        if (isSubmitting) {
            submitIcon.className =
                "fa-solid fa-spinner fa-spin text-xs";

            submitText.textContent = "Reassigning...";
        } else {
            submitIcon.className =
                "fa-solid fa-user-gear text-xs";

            submitText.textContent = "Reassign Staff";
        }
    }

    function showStaffError(message) {
        staffError.textContent = message;
        staffError.classList.remove("hidden");
    }

    function clearError() {
        staffError.textContent = "";
        staffError.classList.add("hidden");
    }

    function showSuccess(message) {
        if (typeof showToast === "function") {
            showToast(message, "success");
            return;
        }

        console.log("SUCCESS:", message);
    }
});