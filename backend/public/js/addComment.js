const addCommentModal = document.getElementById("addCommentModal");
const addCommentForm = document.getElementById("addCommentForm");

const closeAddCommentModal = document.getElementById(
    "closeAddCommentModal",
);

const cancelAddCommentModal = document.getElementById(
    "cancelAddCommentModal",
);

const commentRequestId = document.getElementById(
    "commentRequestId",
);

const commentRequestTitle = document.getElementById(
    "commentRequestTitle",
);

const commentMessage = document.getElementById(
    "commentMessage",
);

const commentMessageError = document.getElementById(
    "commentMessageError",
);

const submitCommentButton = document.getElementById(
    "submitCommentButton",
);

const submitCommentIcon = document.getElementById(
    "submitCommentIcon",
);

const submitCommentText = document.getElementById(
    "submitCommentText",
);

document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-comment-btn");

    if (!button) return;

    const requestId = button.dataset.id;

    openAddCommentModal(requestId);
});

function openAddCommentModal(requestId) {
    if (!requestId) {
        window.toast?.error?.("Invalid service request.");
        return;
    }

    commentRequestId.value = requestId;

    commentMessage.value = "";

    clearCommentError();

    commentRequestTitle.textContent = "Service Request";

    addCommentModal.classList.remove("hidden");
    addCommentModal.classList.add("flex");

    document.body.classList.add("overflow-hidden");

    setTimeout(() => {
        commentMessage.focus();
    }, 300);
}

function closeCommentModal() {
    addCommentModal.classList.add("hidden");
    addCommentModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");

    addCommentForm.reset();

    clearCommentError();

    commentRequestTitle.textContent = "Service Request";

    setCommentLoading(false);
}

closeAddCommentModal.addEventListener(
    "click",
    closeCommentModal,
);

cancelAddCommentModal.addEventListener(
    "click",
    closeCommentModal,
);

addCommentModal.addEventListener("click", (event) => {
    if (event.target === addCommentModal) {
        closeCommentModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        !addCommentModal.classList.contains("hidden")
    ) {
        closeCommentModal();
    }
});

function clearCommentError() {
    commentMessageError.textContent = "";

    commentMessageError.classList.add("hidden");

    commentMessage.classList.remove(
        "border-danger",
        "focus:border-danger",
        "focus:ring-danger/10",
    );
}

function showCommentError(message) {
    commentMessageError.textContent = message;

    commentMessageError.classList.remove("hidden");

    commentMessage.classList.add("border-danger");

    commentMessage.focus();
}

addCommentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearCommentError();

    const reqid= commentRequestId.value;

    const message = commentMessage.value.trim();

   

    if (!message) {
        showCommentError(
            "Please enter a comment.",
        );

        return;
    }

    setCommentLoading(true);

    try {
        const response = await fetch(
            `/servicerequest/addcomment/${reqid}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    message,
                }),
            },
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Failed to add comment.",
            );
        }

        window.toast.success(
            result.message ||
            "Comment added successfully.",
        );

        closeCommentModal();

    } catch (error) {
        console.error(
            "Add comment error:",
            error,
        );

        window.toast?.error?.(
            error.message ||
            "Failed to add comment.",
        );

    } finally {
        setCommentLoading(false);
    }
});

function setCommentLoading(isLoading) {
    submitCommentButton.disabled = isLoading;

    if (isLoading) {
        submitCommentIcon.className =
            "fa-solid fa-spinner fa-spin text-xs";

        submitCommentText.textContent =
            "Adding Comment";

        commentMessage.disabled = true;

    } else {
        submitCommentIcon.className =
            "fa-solid fa-paper-plane text-xs";

        submitCommentText.textContent =
            "Add Comment";

        commentMessage.disabled = false;
    }
}