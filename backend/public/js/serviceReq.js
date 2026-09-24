const searchInput = document.getElementById("search");
const clearSearch = document.getElementById("clearSearch");

function toggleClearButton() {
  if (!searchInput || !clearSearch) {
    return;
  }

  clearSearch.classList.toggle("hidden", searchInput.value.trim() === "");
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

const assignStaffSelect = document.getElementById("assignStaffSelect");

const assignStaffLoading = document.getElementById("assignStaffLoading");

const assignStaffError = document.getElementById("assignStaffError");

const assignStaffSubmit = document.getElementById("assignStaffSubmit");

const assignStaffSubmitIcon = document.getElementById("assignStaffSubmitIcon");

const assignStaffSubmitText = document.getElementById("assignStaffSubmitText");

const closeAssignStaffModal = document.getElementById("closeAssignStaffModal");

const cancelAssignStaff = document.getElementById("cancelAssignStaff");

function openAssignStaffModal(requestId) {
  if (!assignStaffModal) {
    return;
  }

  if (!requestId) {
    window.toast.error("Invalid service request ID");

    return;
  }

  assignRequestId.value = requestId;

  assignStaffSelect.innerHTML = `
        <option value="">
            Loading staff...
        </option>
    `;

  assignStaffSelect.disabled = true;

  assignStaffError.textContent = "";
  assignStaffError.classList.add("hidden");

  assignStaffSubmit.disabled = true;

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

  assignStaffForm.reset();

  assignRequestId.value = "";

  assignStaffSelect.innerHTML = `
        <option value="">
            Select staff member
        </option>
    `;

  assignStaffSelect.disabled = false;

  assignStaffError.textContent = "";
  assignStaffError.classList.add("hidden");

  setAssignButtonLoading(false);
}

async function fetchActiveStaff() {
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
      throw new Error(result.message || "Unable to fetch active staff");
    }

    const staffList = Array.isArray(result.data) ? result.data : [];

    assignStaffSelect.innerHTML = `
            <option value="">
                Select staff member
            </option>
        `;

    if (staffList.length === 0) {
      assignStaffSelect.innerHTML = `
                <option value="">
                    No active staff available
                </option>
            `;

      assignStaffSelect.disabled = true;
      assignStaffSubmit.disabled = true;

      assignStaffError.textContent = "No active staff members are available.";

      assignStaffError.classList.remove("hidden");

      return;
    }

    staffList.forEach((staff) => {
      const firstName = staff.staffUser?.firstname || "";

      const lastName = staff.staffUser?.lastname || "";

      const fullName = `${firstName} ${lastName}`.trim();

      const option = document.createElement("option");

      option.value = staff._id;

      option.textContent = fullName || "Unnamed Staff";

      assignStaffSelect.appendChild(option);
    });

    assignStaffSelect.disabled = false;
    assignStaffSubmit.disabled = false;
  } catch (error) {
    console.error("Fetch active staff error:", error);

    assignStaffSelect.innerHTML = `
            <option value="">
                Unable to load staff
            </option>
        `;

    assignStaffSelect.disabled = true;
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
  } else {
    assignStaffSubmitIcon.className = "fa-solid fa-user-check";

    assignStaffSubmitText.textContent = "Assign Staff";
  }
}

async function assignStaff(requestId, staffId) {
  const response = await fetch(`/admin/servicerequest/${requestId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      staffId,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to assign staff");
  }

  return result;
}

if (assignStaffForm) {
  assignStaffForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const requestId = assignRequestId.value.trim();

    const staffId = assignStaffSelect.value.trim();

    if (!requestId) {
      window.toast.error("Invalid service request ID");

      return;
    }

    if (!staffId) {
      assignStaffError.textContent = "Please select a staff member.";

      assignStaffError.classList.remove("hidden");

      assignStaffSelect.focus();

      return;
    }

    assignStaffError.textContent = "";
    assignStaffError.classList.add("hidden");

    setAssignButtonLoading(true);

    try {
      const result = await assignStaff(requestId, staffId);

      window.toast.success(result.message || "Staff assigned successfully");

      closeAssignStaffModalHandler();

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error("Assign staff error:", error);

      window.toast.error(error.message || "Unable to assign staff");

      setAssignButtonLoading(false);
    }
  });
}

document.querySelectorAll(".assign-staff-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const requestId = button.dataset.id;

    openAssignStaffModal(requestId);
  });
});

if (closeAssignStaffModal) {
  closeAssignStaffModal.addEventListener("click", closeAssignStaffModalHandler);
}

if (cancelAssignStaff) {
  cancelAssignStaff.addEventListener("click", closeAssignStaffModalHandler);
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

  btn.disabled = true;
  text.textContent = "Generating...";

  try {
    const response = await fetch("/admin/servicerequest/exportreport", {
      method: "POST",
    });

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "service-request-report.xlsx";

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Failed to export report");
  } finally {
    btn.disabled = false;
    text.textContent = "Export Report";
  }
}

document.querySelectorAll(".delete-req-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const reqid = button.dataset.id;

    try {
      const response = await fetch(`/admin/servicerequest/delete/${reqid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      window.toast.success(
        result.message || "Service request deleted successfully.",
      );

      button.closest("tr")?.remove();
  
    } catch (error) {
      console.error("Delete request error:", error);

      window.toast.error("Unable to delete service request. Please try again.");
    }
  });
});
