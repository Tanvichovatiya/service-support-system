
const searchInput = document.getElementById("search");
const clearSearch = document.getElementById("clearSearch");

function toggleClearButton() {
  if (!searchInput || !clearSearch) {
    return;
  }

  clearSearch.classList.toggle(
    "hidden",
    searchInput.value.trim() === "",
  );
}

if (searchInput && clearSearch) {
  searchInput.addEventListener("input", toggleClearButton);

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    toggleClearButton();
  });

  toggleClearButton();
}

const assignStaffModal = document.getElementById("assignStaffModal");
const assignStaffForm = document.getElementById("assignStaffForm");
const assignRequestId = document.getElementById("assignRequestId");
const assignRequestTitle = document.getElementById("assignRequestTitle");
const assignStaffList = document.getElementById("assignStaffList");
const selectedStaffCount = document.getElementById("selectedStaffCount");
const assignStaffLoading = document.getElementById("assignStaffLoading");
const assignStaffError = document.getElementById("assignStaffError");
const assignStaffSubmit = document.getElementById("assignStaffSubmit");
const assignStaffSubmitIcon = document.getElementById(
  "assignStaffSubmitIcon",
);
const assignStaffSubmitText = document.getElementById(
  "assignStaffSubmitText",
);
const closeAssignStaffModal = document.getElementById(
  "closeAssignStaffModal",
);
const cancelAssignStaff = document.getElementById("cancelAssignStaff");

let selectedStaffIds = [];

function updateSelectedStaffCount() {
  if (!selectedStaffCount) {
    return;
  }

  const count = selectedStaffIds.length;

  selectedStaffCount.textContent =
    count === 1 ? "1 selected" : `${count} selected`;
}

function updateAssignButton() {
  if (!assignStaffSubmit) {
    return;
  }

  assignStaffSubmit.disabled = selectedStaffIds.length === 0;
}

function handleStaffCheckboxChange(event) {
  const checkbox = event.target;

  if (!checkbox.matches(".staff-checkbox")) {
    return;
  }

  const staffId = checkbox.value;

  if (checkbox.checked) {
    if (!selectedStaffIds.includes(staffId)) {
      selectedStaffIds.push(staffId);
    }
  } else {
    selectedStaffIds = selectedStaffIds.filter(
      (id) => id !== staffId,
    );
  }

  updateSelectedStaffCount();
  updateAssignButton();

  assignStaffError.textContent = "";
  assignStaffError.classList.add("hidden");
}

function renderStaffList(staffList) {
  if (!assignStaffList) {
    return;
  }

  assignStaffList.innerHTML = "";

  if (staffList.length === 0) {
    assignStaffList.innerHTML = `
      <div class="flex flex-col items-center justify-center px-4 py-8 text-center">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <i class="fa-solid fa-user-slash text-sm"></i>
        </div>

        <p class="mt-3 text-sm font-semibold text-text-primary">
          No active staff available
        </p>

        <p class="mt-1 text-xs text-text-secondary">
          There are currently no active staff members available for assignment.
        </p>
      </div>
    `;

    return;
  }

  staffList.forEach((staff) => {
    const firstName = staff.staffUser?.firstname || "";
    const lastName = staff.staffUser?.lastname || "";
    const fullName =
      `${firstName} ${lastName}`.trim() || "Unnamed Staff";
    const email = staff.staffUser?.email || "";

    const staffItem = document.createElement("label");

    staffItem.className =
      "group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition-all duration-200 hover:border-accent hover:bg-accent-soft/20";

    staffItem.innerHTML = `
      <input
        type="checkbox"
        value="${staff._id}"
        class="staff-checkbox h-4 w-4 cursor-pointer rounded border-input-border text-accent focus:ring-2 focus:ring-accent-soft"
      />

      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <i class="fa-solid fa-user-tie text-sm"></i>
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-text-primary">
          ${fullName}
        </p>

        ${
          email
            ? `
              <p class="mt-0.5 truncate text-xs text-text-secondary">
                ${email}
              </p>
            `
            : ""
        }
      </div>

      <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background-soft text-text-muted transition-colors group-hover:text-accent">
        <i class="fa-solid fa-check text-xs"></i>
      </div>
    `;

    assignStaffList.appendChild(staffItem);
  });
}

function openAssignStaffModal(requestId, requestTitle = "") {
  if (!assignStaffModal) {
    return;
  }

  if (!requestId) {
    window.toast.error("Invalid service request ID");
    return;
  }

  selectedStaffIds = [];

  assignRequestId.value = requestId;

  if (assignRequestTitle) {
    assignRequestTitle.textContent =
      requestTitle || "Select staff for this request";
  }

  updateSelectedStaffCount();

  assignStaffError.textContent = "";
  assignStaffError.classList.add("hidden");

  assignStaffSubmit.disabled = true;

  assignStaffList.innerHTML = `
    <div class="flex items-center justify-center px-4 py-8 text-sm text-text-secondary">
      Loading staff...
    </div>
  `;

  assignStaffModal.classList.remove("hidden");
  assignStaffModal.classList.add("flex");

  document.body.classList.add("overflow-hidden");

  fetchActiveStaff();
}

function closeAssignStaffModalHandler() {
  if (!assignStaffModal) {
    return;
  }

  assignStaffModal.classList.add("hidden");
  assignStaffModal.classList.remove("flex");

  document.body.classList.remove("overflow-hidden");

  if (assignStaffForm) {
    assignStaffForm.reset();
  }

  assignRequestId.value = "";

  if (assignRequestTitle) {
    assignRequestTitle.textContent = "Select staff for this request";
  }

  selectedStaffIds = [];

  if (assignStaffList) {
    assignStaffList.innerHTML = "";
  }

  assignStaffError.textContent = "";
  assignStaffError.classList.add("hidden");

  updateSelectedStaffCount();
  setAssignButtonLoading(false);
}

async function fetchActiveStaff() {
  if (!assignStaffLoading || !assignStaffForm) {
    return;
  }

  assignStaffLoading.classList.remove("hidden");
  assignStaffForm.classList.add("hidden");

  try {
    const response = await fetch("/admin/staff/active", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to fetch active staff",
      );
    }

    const staffList = Array.isArray(result.data) ? result.data : [];

    renderStaffList(staffList);

    if (staffList.length === 0) {
      assignStaffSubmit.disabled = true;

      assignStaffError.textContent =
        "No active staff members are available.";

      assignStaffError.classList.remove("hidden");

      return;
    }

    selectedStaffIds = [];

    updateSelectedStaffCount();
    updateAssignButton();
  } catch (error) {
    console.error("Fetch active staff error:", error);

    assignStaffList.innerHTML = `
      <div class="flex flex-col items-center justify-center px-4 py-8 text-center">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-danger-light text-danger">
          <i class="fa-solid fa-triangle-exclamation text-sm"></i>
        </div>

        <p class="mt-3 text-sm font-semibold text-text-primary">
          Unable to load staff
        </p>

        <p class="mt-1 text-xs text-text-secondary">
          Please close this window and try again.
        </p>
      </div>
    `;

    assignStaffSubmit.disabled = true;

    assignStaffError.textContent =
      error.message || "Unable to load active staff.";

    assignStaffError.classList.remove("hidden");
  } finally {
    assignStaffLoading.classList.add("hidden");
    assignStaffForm.classList.remove("hidden");
  }
}

function setAssignButtonLoading(isLoading) {
  if (!assignStaffSubmit) {
    return;
  }

  assignStaffSubmit.disabled = isLoading;

  if (isLoading) {
    assignStaffSubmitIcon.className = "fa-solid fa-spinner fa-spin";
    assignStaffSubmitText.textContent = "Assigning...";
    return;
  }

  assignStaffSubmitIcon.className =
    "fa-solid fa-user-check text-xs";
  assignStaffSubmitText.textContent = "Assign Staff";

  updateAssignButton();
}

async function assignStaff(requestId, staffIds) {
  const response = await fetch(
    `/admin/servicerequest/${requestId}/assign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        staffIds,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to assign staff",
    );
  }

  return result;
}

if (assignStaffList) {
  assignStaffList.addEventListener(
    "change",
    handleStaffCheckboxChange,
  );
}

if (assignStaffForm) {
  assignStaffForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const requestId = assignRequestId.value.trim();
    const staffIds = [...selectedStaffIds];

    if (!requestId) {
      window.toast.error("Invalid service request ID");
      return;
    }

    if (staffIds.length === 0) {
      assignStaffError.textContent =
        "Please select at least one staff member.";

      assignStaffError.classList.remove("hidden");
      return;
    }

    assignStaffError.textContent = "";
    assignStaffError.classList.add("hidden");

    setAssignButtonLoading(true);

    try {
      const result = await assignStaff(requestId, staffIds);

      window.toast.success(
        result.message || "Staff assigned successfully",
      );

      closeAssignStaffModalHandler();

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error("Assign staff error:", error);

      window.toast.error(
        error.message || "Unable to assign staff",
      );

      setAssignButtonLoading(false);
    }
  });
}

document.querySelectorAll(".assign-staff-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const requestId = button.dataset.id;
    const requestTitle = button.dataset.title || "";

    openAssignStaffModal(requestId, requestTitle);
  });
});

if (closeAssignStaffModal) {
  closeAssignStaffModal.addEventListener(
    "click",
    closeAssignStaffModalHandler,
  );
}

if (cancelAssignStaff) {
  cancelAssignStaff.addEventListener(
    "click",
    closeAssignStaffModalHandler,
  );
}

if (assignStaffModal) {
  assignStaffModal.addEventListener("click", (event) => {
    if (event.target === assignStaffModal) {
      closeAssignStaffModalHandler();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    assignStaffModal &&
    !assignStaffModal.classList.contains("hidden")
  ) {
    closeAssignStaffModalHandler();
  }
});

async function exportReport() {
  const btn = document.getElementById("exportBtn");
  const text = document.getElementById("exportText");

  if (!btn || !text) {
    return;
  }

  btn.disabled = true;
  text.textContent = "Generating...";

  try {
    const response = await fetch(
      "/admin/servicerequest/exportreport",
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "service-request-report.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export report error:", error);

    window.toast.error(
      error.message || "Failed to export report",
    );
  } finally {
    btn.disabled = false;
    text.textContent = "Export Report";
  }
}

document.querySelectorAll(".delete-req-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const reqid = button.dataset.id;

    if (!reqid) {
      window.toast.error("Invalid service request ID");
      return;
    }

    try {
      const response = await fetch(
        `/admin/servicerequest/delete/${reqid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete service request",
        );
      }

      window.toast.success(
        result.message ||
          "Service request deleted successfully.",
      );

      button.closest("tr")?.remove();
    } catch (error) {
      console.error("Delete request error:", error);

      window.toast.error(
        error.message ||
          "Unable to delete service request. Please try again.",
      );
    }
  });
});
