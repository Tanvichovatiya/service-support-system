
document.addEventListener("DOMContentLoaded", () => {
  
  const modal = document.getElementById("reassignStaffModal");
  const form = document.getElementById("reassignStaffForm");

  const closeBtn = document.getElementById("closeReassignStaffModal");
  const cancelBtn = document.getElementById("cancelReassignStaff");

  const requestIdInput = document.getElementById("reassignRequestId");
  const requestTitle = document.getElementById("reassignRequestTitle");

  const currentStaffList = document.getElementById("currentStaffList");
  const staffList = document.getElementById("reassignStaffList");

  const selectedStaffList = document.getElementById("selectedStaffList");
  const selectedStaffCount = document.getElementById("selectedStaffCount");

  const staffError = document.getElementById("reassignStaffError");
  const loading = document.getElementById("reassignStaffLoading");

  const submitBtn = document.getElementById("reassignStaffSubmit");
  const submitIcon = document.getElementById("reassignStaffSubmitIcon");
  const submitText = document.getElementById("reassignStaffSubmitText");

  let selectedStaffIds = [];
  let allStaff = [];

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".reassign-staff-btn");

    if (!button) return;

    const requestId = button.dataset.id;

    if (!requestId) {
      showError("Service request ID is missing.");
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
        fetch(`/admin/servicerequest/${requestId}/data`, {
          headers: {
            Accept: "application/json",
          },
        }),

        fetch("/admin/staff/active", {
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

      const requestResult = await parseResponse(requestResponse);
      const staffResult = await parseResponse(staffResponse);

      if (!requestResponse.ok) {
        throw new Error(
          requestResult.message || "Failed to load service request."
        );
      }

      if (!staffResponse.ok) {
        throw new Error(
          staffResult.message || "Failed to load active staff."
        );
      }

      const request = extractRequest(requestResult);
      const activeStaff = extractStaffList(staffResult);

      if (!request) {
        throw new Error("Service request data not found.");
      }

      allStaff = activeStaff;

      const currentStaff = getCurrentAssignedStaff(request);

      requestTitle.textContent = request.title || "Service Request";

      renderCurrentStaff(currentStaff);

      selectedStaffIds = currentStaff
        .map(getStaffId)
        .filter(Boolean)
        .map(String);

      renderStaffList(allStaff);
      renderSelectedStaff();

      clearError();
    } catch (error) {
      console.error("Reassign modal error:", error);
      showError(error.message || "Unable to load staff information.");
    } finally {
      setLoading(false);
    }
  }

  async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();

    return {
      message: text || "Unexpected server response.",
    };
  }

  function extractRequest(result) {
    return (
      result?.data?.request ||
      result?.data?.serviceRequest ||
      result?.request ||
      result?.serviceRequest ||
      (result?.data?._id ? result.data : null) ||
      (result?._id ? result : null)
    );
  }

  function extractStaffList(result) {
    if (Array.isArray(result?.data)) {
      return result.data;
    }

    if (Array.isArray(result?.data?.staff)) {
      return result.data.staff;
    }

    if (Array.isArray(result?.data?.staffs)) {
      return result.data.staffs;
    }

    if (Array.isArray(result?.staff)) {
      return result.staff;
    }

    if (Array.isArray(result?.staffs)) {
      return result.staffs;
    }

    return [];
  }

  function getCurrentAssignedStaff(request) {
    if (Array.isArray(request.assignedStaff)) {
      return request.assignedStaff;
    }

    if (Array.isArray(request.assignedStaffs)) {
      return request.assignedStaffs;
    }

    if (request.assignedStaff) {
      return [request.assignedStaff];
    }

    if (request.assignedStaffs) {
      return [request.assignedStaffs];
    }

    if (Array.isArray(request.assignedStaffIds)) {
      return request.assignedStaffIds
        .map((id) => {
          const staffId = getStaffId(id);

          return (
            allStaff.find(
              (staff) => getStaffId(staff) === staffId
            ) || {
              _id: staffId,
            }
          );
        })
        .filter(Boolean);
    }

    return [];
  }

  function renderCurrentStaff(staffMembers) {
    currentStaffList.innerHTML = "";

    if (!staffMembers.length) {
      currentStaffList.innerHTML = `
        <div class="flex items-center gap-3 rounded-admin border border-border bg-surface-soft px-4 py-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-light text-warning-dark">
            <i class="fa-solid fa-user-slash text-sm"></i>
          </div>

          <div class="min-w-0">
            <p class="text-sm font-semibold text-text-primary">
              No staff assigned
            </p>

            <p class="mt-0.5 text-xs text-text-muted">
              No staff member is currently assigned.
            </p>
          </div>
        </div>
      `;

      return;
    }

    staffMembers.forEach((staff) => {
      const name = getStaffName(staff);
      const email = getStaffEmail(staff);
      const employeeId = staff?.employeeId || "-";
      const profilePic = getStaffProfilePic(staff);

      const item = document.createElement("div");

      item.className =
        "flex items-center gap-3 rounded-admin border border-info/20 bg-info-light/40 px-4 py-3";

      item.innerHTML = `
        ${
          profilePic
            ? `
              <img
                src="${escapeHtml(profilePic)}"
                alt="${escapeHtml(name)}"
                class="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            `
            : `
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info-light text-info">
                <i class="fa-solid fa-user-tie text-sm"></i>
              </div>
            `
        }

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-semibold text-text-primary">
              ${escapeHtml(name)}
            </p>

            <span class="shrink-0 rounded-full bg-info-light px-2 py-0.5 text-[9px] font-semibold text-info">
              CURRENT
            </span>
          </div>

          <div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p class="truncate text-xs text-text-muted">
              ${escapeHtml(email)}
            </p>

            <span class="text-[10px] text-text-muted">
              ID: ${escapeHtml(employeeId)}
            </span>
          </div>
        </div>
      `;

      currentStaffList.appendChild(item);
    });
  }

  function renderStaffList(staffMembers) {
    staffList.innerHTML = "";

    if (!staffMembers.length) {
      staffList.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center rounded-admin border border-border bg-surface px-5 py-10 text-center">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
            <i class="fa-solid fa-users-slash text-sm"></i>
          </div>

          <p class="mt-3 text-sm font-semibold text-text-primary">
            No active staff available
          </p>

          <p class="mt-1 text-xs text-text-muted">
            There are no active staff members available.
          </p>
        </div>
      `;

      return;
    }

    staffMembers.forEach((staff) => {
      const staffId = getStaffId(staff);

      if (!staffId) return;

      const name = getStaffName(staff);
      const profilePic = getStaffProfilePic(staff);

      const card = document.createElement("button");

      card.type = "button";
      card.dataset.staffId = staffId;

      card.className =
        "group relative flex min-w-0 cursor-pointer items-center gap-3 rounded-admin border border-border bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-light hover:bg-brand-soft/40 hover:shadow-admin-sm focus:outline-none focus:ring-2 focus:ring-brand/20";

      card.innerHTML = `
        <div class="staff-select-icon flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-white transition">
          <i class="fa-solid fa-check hidden text-[9px]"></i>
        </div>

        ${
          profilePic
            ? `
              <img
                src="${escapeHtml(profilePic)}"
                alt="${escapeHtml(name)}"
                class="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            `
            : `
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <i class="fa-solid fa-user text-sm"></i>
              </div>
            `
        }

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-text-primary">
            ${escapeHtml(name)}
          </p>
        </div>
      `;

      card.addEventListener("click", () => {
        toggleStaff(staffId, card);
      });

      staffList.appendChild(card);

      updateStaffCard(card);
    });
  }

  function toggleStaff(staffId, card) {
    const id = String(staffId);
    const index = selectedStaffIds.indexOf(id);

    if (index === -1) {
      selectedStaffIds.push(id);
    } else {
      selectedStaffIds.splice(index, 1);
    }

    updateStaffCard(card);
    renderSelectedStaff();
    clearError();
  }

  function updateStaffCard(card) {
    const staffId = String(card.dataset.staffId);
    const isSelected = selectedStaffIds.includes(staffId);

    const icon = card.querySelector(".staff-select-icon");
    const check = icon?.querySelector("i");

    card.classList.toggle("border-brand", isSelected);
    card.classList.toggle("bg-brand-soft", isSelected);
    card.classList.toggle("shadow-admin-sm", isSelected);

    card.classList.toggle("border-border", !isSelected);
    card.classList.toggle("bg-surface", !isSelected);

    icon?.classList.toggle("border-brand", isSelected);
    icon?.classList.toggle("bg-brand", isSelected);

    icon?.classList.toggle("border-border", !isSelected);
    icon?.classList.toggle("bg-surface", !isSelected);

    check?.classList.toggle("hidden", !isSelected);
  }

  function renderSelectedStaff() {
    selectedStaffList.innerHTML = "";

    selectedStaffCount.textContent = String(selectedStaffIds.length);

    if (!selectedStaffIds.length) {
      selectedStaffList.innerHTML = `
        <div class="col-span-full flex items-center gap-2 rounded-admin-sm border border-border bg-surface px-3 py-2.5 text-xs text-text-muted">
          <i class="fa-solid fa-circle-info"></i>
          <span>No staff selected</span>
        </div>
      `;

      submitBtn.disabled = true;
      return;
    }

    selectedStaffIds.forEach((staffId) => {
      const staff = allStaff.find(
        (item) => String(getStaffId(item)) === String(staffId)
      );

      if (!staff) return;

      const name = getStaffName(staff);

      const item = document.createElement("div");

      item.className =
        "flex min-w-0 items-center gap-2 rounded-admin-sm border border-brand-muted bg-surface px-2.5 py-2";

      item.innerHTML = `
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
          <i class="fa-solid fa-user text-[10px]"></i>
        </div>

        <p class="min-w-0 flex-1 truncate text-xs font-semibold text-text-primary">
          ${escapeHtml(name)}
        </p>

        <button
          type="button"
          class="remove-selected-staff flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition hover:bg-danger-light hover:text-danger"
          data-id="${escapeHtml(staffId)}"
          aria-label="Remove ${escapeHtml(name)}"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      `;

      item
        .querySelector(".remove-selected-staff")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          removeSelectedStaff(staffId);
        });

      selectedStaffList.appendChild(item);
    });

    submitBtn.disabled = false;
  }

  function removeSelectedStaff(staffId) {
    const id = String(staffId);

    selectedStaffIds = selectedStaffIds.filter(
      (item) => String(item) !== id
    );

    const card = [...staffList.querySelectorAll("[data-staff-id]")].find(
      (item) => String(item.dataset.staffId) === id
    );

    if (card) {
      updateStaffCard(card);
    }

    renderSelectedStaff();
    clearError();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearError();

    const requestId = requestIdInput.value.trim();

    const staffIds = [...new Set(selectedStaffIds.map(String).filter(Boolean))];

    if (!requestId) {
      showError("Service request ID is missing.");
      return;
    }

    if (!staffIds.length) {
      showError("Please select at least one staff member.");
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
            Accept: "application/json",
          },
          body: JSON.stringify({ staffIds }),
        }
      );

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to reassign staff."
        );
      }

      closeModal();

      if (window.toast?.success) {
        window.toast.success(
          result.message || "Staff reassigned successfully."
        );
      }

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error("Reassign staff error:", error);

      showError(error.message || "Failed to reassign staff.");
      setSubmitting(false);
    }
  });

  function getStaffId(staff) {
    if (!staff) return null;

    if (typeof staff === "string" || typeof staff === "number") {
      return String(staff);
    }

    return String(staff._id || staff.id || staff.$oid || "") || null;
  }

  function getStaffUser(staff) {
    return (
      staff?.user ||
      staff?.staffUser ||
      (typeof staff?.userId === "object" ? staff.userId : null) ||
      {}
    );
  }

  function getStaffName(staff) {
    const user = getStaffUser(staff);

    const firstName = user.firstname || user.firstName || "";
    const lastName = user.lastname || user.lastName || "";

    return (
      `${firstName} ${lastName}`.trim() ||
      user.name ||
      staff?.name ||
      user.email ||
      staff?.email ||
      "Staff Member"
    );
  }

  function getStaffEmail(staff) {
    const user = getStaffUser(staff);

    return user.email || staff?.email || "-";
  }

  function getStaffProfilePic(staff) {
    const user = getStaffUser(staff);

    return user.profilePic || staff?.profilePic || "";
  }

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

    currentStaffList.innerHTML = "";
    staffList.innerHTML = "";

    selectedStaffList.innerHTML = `
      <div class="col-span-full flex items-center gap-2 rounded-admin-sm border border-border bg-surface px-3 py-2.5 text-xs text-text-muted">
        <i class="fa-solid fa-circle-info"></i>
        <span>No staff selected</span>
      </div>
    `;

    selectedStaffCount.textContent = "0";

    selectedStaffIds = [];
    allStaff = [];

    clearError();

    setLoading(false);
    setSubmitting(false);
  }

  function setLoading(isLoading) {
    loading.classList.toggle("hidden", !isLoading);
    loading.classList.toggle("flex", isLoading);

    form.classList.toggle("hidden", isLoading);

    if (isLoading) {
      submitBtn.disabled = true;
      return;
    }

    submitBtn.disabled = selectedStaffIds.length === 0;
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;

    submitIcon.className = isSubmitting
      ? "fa-solid fa-spinner fa-spin text-xs"
      : "fa-solid fa-user-gear text-xs";

    submitText.textContent = isSubmitting
      ? "Reassigning..."
      : "Reassign Staff";

    if (!isSubmitting) {
      submitBtn.disabled = selectedStaffIds.length === 0;
    }
  }

  function showError(message) {
    staffError.textContent = message;
    staffError.classList.remove("hidden");
  }

  function clearError() {
    staffError.textContent = "";
    staffError.classList.add("hidden");
  }

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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});