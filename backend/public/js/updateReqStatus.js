
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("updateStatusModal");

    if (!modal) return;

    const form = document.getElementById("updateStatusForm");

    const closeButton = document.getElementById(
        "closeUpdateStatusModal",
    );

    const cancelButton = document.getElementById(
        "cancelUpdateStatusModal",
    );

    const loading = document.getElementById(
        "updateStatusLoading",
    );

    const requestIdInput = document.getElementById(
        "updateStatusRequestId",
    );

    const requestTitle = document.getElementById(
        "updateStatusRequestTitle",
    );

    const currentStatusText = document.getElementById(
        "currentStatusText",
    );

    const currentStatusIcon = document.getElementById(
        "currentStatusIcon",
    );

    const newStatusSelect = document.getElementById(
        "newRequestStatus",
    );

    const newStatusError = document.getElementById(
        "newStatusError",
    );

    const transitionText = document.getElementById(
        "statusTransitionText",
    );

    const statusWarning = document.getElementById(
        "statusWarning",
    );

    const updateButton = document.getElementById(
        "updateStatusButton",
    );

    const updateButtonText = document.getElementById(
        "updateStatusButtonText",
    );

    const updateButtonIcon = document.getElementById(
        "updateStatusButtonIcon",
    );


    

    const allowedTransitions = {
        pending: [
            "assigned",
            "cancelled",
        ],

        assigned: [
            "in_progress",
            "cancelled",
        ],

        in_progress: [
            "completed",
            "cancelled",
        ],

        completed: [],

        cancelled: [],
    };


   
    const statusLabels = {
        pending: "Pending",
        assigned: "Assigned",
        in_progress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled",
    };



    const statusIcons = {
        pending: "fa-clock",
        assigned: "fa-user-check",
        in_progress: "fa-spinner",
        completed: "fa-circle-check",
        cancelled: "fa-ban",
    };


    
    const statusStyles = {
        pending: {
            wrapper: [
                "bg-warning-light",
                "text-warning-dark",
            ],
        },

        assigned: {
            wrapper: [
                "bg-info-light",
                "text-info-dark",
            ],
        },

        in_progress: {
            wrapper: [
                "bg-brand/10",
                "text-brand",
            ],
        },

        completed: {
            wrapper: [
                "bg-success-light",
                "text-success-dark",
            ],
        },

        cancelled: {
            wrapper: [
                "bg-danger-light",
                "text-danger-dark",
            ],
        },
    };

    function formatStatus(status) {
        return (
            statusLabels[status] ||
            status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase(),
                )
        );
    }



    function updateCurrentStatusUI(status) {
        currentStatusText.textContent = formatStatus(status);

        const icon = statusIcons[status] || "fa-circle-info";

        currentStatusIcon.innerHTML = `
            <i class="fa-solid ${icon} text-sm"></i>
        `;
      
        Object.values(statusStyles).forEach((style) => {
            style.wrapper.forEach((className) => {
                currentStatusIcon.classList.remove(className);
            });
        });

        const style = statusStyles[status];

        if (style) {
            style.wrapper.forEach((className) => {
                currentStatusIcon.classList.add(className);
            });
        }
    }



    function loadAvailableStatuses(currentStatus) {
        newStatusSelect.innerHTML = `
            <option value="">
                Select new status
            </option>
        `;

        const nextStatuses =
            allowedTransitions[currentStatus] || [];


        /*
         * No transition available
         */

        if (nextStatuses.length === 0) {
            newStatusSelect.disabled = true;

            transitionText.textContent =
                `No status changes are available from "${formatStatus(
                    currentStatus,
                )}".`;

            updateButton.disabled = true;

            updateButton.classList.add(
                "cursor-not-allowed",
                "opacity-50",
            );

            return;
        }


        /*
         * Enable select
         */

        newStatusSelect.disabled = false;

        updateButton.disabled = false;

        updateButton.classList.remove(
            "cursor-not-allowed",
            "opacity-50",
        );


        /*
         * Add options
         */

        nextStatuses.forEach((status) => {
            const option = document.createElement("option");

            option.value = status;

            option.textContent = formatStatus(status);

            newStatusSelect.appendChild(option);
        });


        transitionText.textContent =
            `You can change this request from "${formatStatus(
                currentStatus,
            )}" to one of the available statuses.`;
    }

    function openModal(requestId, currentStatus, title = "") {
        requestIdInput.value = requestId;

        requestTitle.textContent =
            title || "Service Request";

        updateCurrentStatusUI(currentStatus);

        loadAvailableStatuses(currentStatus);

        newStatusSelect.value = "";

        newStatusError.textContent = "";

        newStatusError.classList.add("hidden");

        statusWarning.classList.add("hidden");

        resetButton();

        modal.classList.remove("hidden");

        modal.classList.add("flex");

        document.body.classList.add("overflow-hidden");
    }




    function closeModal() {
        modal.classList.add("hidden");

        modal.classList.remove("flex");

        document.body.classList.remove("overflow-hidden");

        form.reset();

        loading.classList.add("hidden");

        form.classList.remove("hidden");

        updateButton.disabled = false;

        updateButton.classList.remove(
            "cursor-not-allowed",
            "opacity-50",
        );
    }


    function resetButton() {
        updateButton.disabled = false;

        updateButton.classList.remove(
            "cursor-not-allowed",
            "opacity-50",
        );

        updateButtonIcon.className =
            "fa-solid fa-check text-xs";

        updateButtonText.textContent =
            "Update Status";
    }



    function setButtonLoading(isLoading) {
        if (isLoading) {
            updateButton.disabled = true;

            updateButton.classList.add(
                "cursor-not-allowed",
                "opacity-70",
            );

            updateButtonIcon.className =
                "fa-solid fa-spinner fa-spin text-xs";

            updateButtonText.textContent =
                "Updating...";
        } else {
            resetButton();
        }
    }



    newStatusSelect.addEventListener(
        "change",
        () => {
            const status =
                newStatusSelect.value;


            /*
             * Clear error
             */

            newStatusError.textContent = "";

            newStatusError.classList.add("hidden");


            /*
             * Cancellation warning
             */

            if (status === "cancelled") {
                statusWarning.classList.remove("hidden");
            } else {
                statusWarning.classList.add("hidden");
            }


            /*
             * Transition preview
             */

            if (status) {
                transitionText.textContent =
                    `Status will change to "${formatStatus(
                        status,
                    )}".`;
            }
        },
    );


    form.addEventListener("submit", async (event) => {
        event.preventDefault();


        const requestId =
            requestIdInput.value;

        const status =
            newStatusSelect.value;


        if (!requestId) {
            showError(
                "Unable to identify the service request.",
            );

            return;
        }


        if (!status) {
            showError(
                "Please select a new status.",
            );

            newStatusSelect.focus();

            return;
        }


        setButtonLoading(true);


        try {

         
            const response = await fetch(
                `/admin/servicerequest/${requestId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        status,
                    }),
                },
            );


            const result =
                await response.json();

            window.toast.success(
                result.message ||
                    "Request status updated successfully.",
                "success",
            );


            closeModal();


            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error(
                "Update request status error:",
                error,
            );

            window.toast.error(
                error.message ||
                    "Failed to update request status.",
            );

            setButtonLoading(false);
        }
    });



    function showError(message) {
        newStatusError.textContent = message;

        newStatusError.classList.remove("hidden");
    }


    closeButton.addEventListener(
        "click",
        closeModal,
    );

    cancelButton.addEventListener(
        "click",
        closeModal,
    );


  
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });



    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                !modal.classList.contains("hidden")
            ) {
                closeModal();
            }
        },
    );



    document.addEventListener(
        "click",
        (event) => {
            const button =
                event.target.closest(
                    ".update-status-btn",
                );

            if (!button) return;


            const requestId =
                button.dataset.id;

            const currentStatus =
                button.dataset.status;



            const row =
                button.closest("tr");

            const titleElement =
                row?.querySelector(
                    'td:first-child p[title]',
                );

            const title =
                titleElement?.getAttribute(
                    "title",
                ) || "";


            openModal(
                requestId,
                currentStatus,
                title,
            );
        },
    );
});