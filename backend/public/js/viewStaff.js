

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("viewStaffModal");
  const backdrop = document.getElementById("viewStaffBackdrop");

  const closeButton = document.getElementById("closeViewStaff");
  const closeFooterButton = document.getElementById(
    "closeViewStaffFooter"
  );

  const loading = document.getElementById("viewStaffLoading");
  const error = document.getElementById("viewStaffError");
  const content = document.getElementById("viewStaffContent");

  const errorMessage = document.getElementById(
    "viewStaffErrorMessage"
  );

  const retryButton = document.getElementById("retryViewStaff");

  let currentStaffId = null;


  function openModal() {
    modal.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");

    resetModal();
  }



  function closeModal() {
    modal.classList.add("hidden");

    document.body.classList.remove("overflow-hidden");

    currentStaffId = null;
  }



  function resetModal() {
    loading.classList.remove("hidden");

    error.classList.add("hidden");

    content.classList.add("hidden");

    error.classList.remove("flex");
  }



  function showError(message) {
    loading.classList.add("hidden");

    content.classList.add("hidden");

    error.classList.remove("hidden");
    error.classList.add("flex");

    errorMessage.textContent =
      message || "Unable to load staff details.";
  }


  async function loadStaff(staffId) {
    currentStaffId = staffId;

    resetModal();

    try {
      const response = await fetch(
        `/admin/staff/${encodeURIComponent(staffId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );


      const result = await response.json();


      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load staff details."
        );
      }


      if (!result.data) {
        throw new Error("Staff details not found.");
      }


      renderStaff(result.data);


      loading.classList.add("hidden");

      error.classList.add("hidden");
      error.classList.remove("flex");

      content.classList.remove("hidden");

    } catch (err) {
      console.error("View staff error:", err);

      showError(err.message);
    }
  }



  function renderStaff(staff) {
    const user = staff.user || {};

    const fullName =
      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
      "Unknown Staff";


    document.getElementById("staffName").textContent =
      fullName;

    document.getElementById("staffEmployeeId").textContent =
      `Employee ID: ${staff.employeeId || ""}`;

    document.getElementById("staffEmail").textContent =
      user.email || "";

    document.getElementById("staffGender").textContent =
      formatText(user.gender);

    document.getElementById("staffDepartment").textContent =
      formatText(staff.department);

    document.getElementById("staffCreatedAt").textContent =
      formatDate(staff.createdAt);


    document.getElementById("staffAvatar").textContent =
      getInitials(
        user.firstname,
        user.lastname
      );



    const activeBadge =
      document.getElementById("staffActiveBadge");

    activeBadge.textContent =
      user.isActive ? "Active" : "Inactive";

    activeBadge.className =
      user.isActive
        ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
        : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700";


    const onlineBadge =
      document.getElementById("staffOnlineBadge");

    onlineBadge.textContent =
      staff.isOnline ? "Online" : "Offline";

    onlineBadge.className =
      staff.isOnline
        ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
        : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600";


    document.getElementById("staffAvailability").textContent =
      staff.isOnline
        ? "  Online"
        : "Offline";



    renderSkills(staff.skills);

    renderRecentRequests(staff.recentRequests);
  }



  function renderSkills(skills) {
    const container =
      document.getElementById("staffSkills");

    container.innerHTML = "";


    if (!Array.isArray(skills) || skills.length === 0) {
      container.innerHTML = `
        <span class="text-sm text-gray-400">
          No skills available
        </span>
      `;

      return;
    }


    skills.forEach((skill) => {
      const badge = document.createElement("span");

      badge.className =
        "rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand";

      badge.textContent = skill;

      container.appendChild(badge);
    });
  }



  function renderRecentRequests(requests) {
    const container =
      document.getElementById("recentRequests");

    container.innerHTML = "";


    if (!Array.isArray(requests) || requests.length === 0) {
      container.innerHTML = `
        <div
          class="rounded-xl  shadow-admin p-6 text-center"
        >
          <div
            class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400"
          >
            <i class="fa-solid fa-inbox"></i>
          </div>

          <p class="mt-3 text-sm font-medium text-gray-700">
            No recent requests
          </p>

          <p class="mt-1 text-xs text-gray-500">
            No service requests have been assigned to this staff member.
          </p>
        </div>
      `;

      return;
    }


    requests.forEach((request) => {
      const card = document.createElement("div");

      card.className =
        "rounded-xl border border-accent-light p-4 transition hover:border-brand/30 hover:shadow-sm";


      const requester =
        request.user
          ? `${request.user.firstname || ""} ${
              request.user.lastname || ""
            }`.trim()
          : "Unknown User";


      const category =
        request.category?.name || "Uncategorized";


      card.innerHTML = `
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div class="min-w-0 flex-1">

            <div class="flex flex-wrap items-center gap-2">

              <h5 class="truncate text-sm font-semibold text-gray-900">
                ${escapeHtml(request.title || "Untitled Request")}
              </h5>

              ${renderPriorityBadge(request.priority)}

              ${renderStatusBadge(request.status)}

            </div>


            <p class="mt-1 text-xs text-gray-500">
              ${escapeHtml(category)}
              <span class="mx-1">•</span>
              ${escapeHtml(requester)}
            </p>


            ${
              request.description
                ? `
                  <p class="mt-2 line-clamp-2 text-sm text-gray-600">
                    ${escapeHtml(request.description)}
                  </p>
                `
                : ""
            }

          </div>


          <span class="shrink-0 text-xs text-gray-400">
            ${formatDate(request.createdAt)}
          </span>

        </div>
      `;


      container.appendChild(card);
    });
  }


  

  function renderPriorityBadge(priority) {
    if (!priority) {
      return "";
    }


    const value =
      String(priority).toLowerCase();


    let classes =
      "bg-gray-100 text-gray-600";


    if (value === "high" || value === "urgent") {
      classes =
        "bg-red-50 text-red-700";
    } else if (value === "medium") {
      classes =
        "bg-yellow-50 text-yellow-700";
    } else if (value === "low") {
      classes =
        "bg-green-50 text-green-700";
    }


    return `
      <span
        class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${classes}"
      >
        ${escapeHtml(priority)}
      </span>
    `;
  }



  function renderStatusBadge(status) {
    if (!status) {
      return "";
    }


    const value =
      String(status).toLowerCase();


    let classes =
      "bg-gray-100 text-gray-600";


    if (
      value === "completed" ||
      value === "resolved"
    ) {
      classes =
        "bg-green-50 text-green-700";
    } else if (
      value === "pending" ||
      value === "open"
    ) {
      classes =
        "bg-yellow-50 text-yellow-700";
    } else if (
      value === "in progress" ||
      value === "in_progress"
    ) {
      classes =
        "bg-blue-50 text-blue-700";
    } else if (value === "cancelled") {
      classes =
        "bg-red-50 text-red-700";
    }


    return `
      <span
        class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${classes}"
      >
        ${escapeHtml(status)}
      </span>
    `;
  }



  function formatDate(date) {
    if (!date) {
      return "--";
    }


    const parsedDate = new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }


    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }


  function formatText(value) {
    if (!value) {
      return "--";
    }


    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }



  function getInitials(firstname, lastname) {
    const first =
      firstname?.trim()?.charAt(0) || "";

    const last =
      lastname?.trim()?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "--";
  }


  

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  document.addEventListener("click", (event) => {
    const button =
      event.target.closest(".view-staff-btn");


    if (!button) {
      return;
    }


    const staffId =
      button.dataset.staffId;


    if (!staffId) {
      return;
    }


    openModal();

    loadStaff(staffId);
  });



  closeButton.addEventListener(
    "click",
    closeModal
  );


  closeFooterButton.addEventListener(
    "click",
    closeModal
  );


  backdrop.addEventListener(
    "click",
    closeModal
  );



  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !modal.classList.contains("hidden")
    ) {
      closeModal();
    }
  });



  retryButton.addEventListener("click", () => {
    if (!currentStaffId) {
      return;
    }

    loadStaff(currentStaffId);
  });
});

