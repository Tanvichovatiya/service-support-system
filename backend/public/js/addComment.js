const addCommentModal = document.getElementById("addCommentModal");
const addCommentForm = document.getElementById("addCommentForm");

const closeAddCommentModal = document.getElementById(
    "closeAddCommentModal"
);
const cancelAddCommentModal = document.getElementById(
    "cancelAddCommentModal"
);

const commentRequestId = document.getElementById("commentRequestId");
const commentRequestTitle = document.getElementById(
    "commentRequestTitle"
);
const commentMessage = document.getElementById("commentMessage");
const commentMessageError = document.getElementById(
    "commentMessageError"
);

const submitCommentButton = document.getElementById(
    "submitCommentButton"
);
const submitCommentIcon = document.getElementById(
    "submitCommentIcon"
);
const submitCommentText = document.getElementById(
    "submitCommentText"
);

document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-comment-btn");

    if (!button) {
        return;
    }

    openAddCommentModal(button.dataset.id);
});

function openAddCommentModal(requestId) {
    if (!requestId) {
        window.toast?.error?.("Invalid service request.");
        return;
    }

    commentRequestId.value = requestId;
    commentRequestTitle.textContent = "Service Request";
    commentMessage.value = "";

    clearCommentError();

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

    commentRequestTitle.textContent = "Service Request";

    clearCommentError();
    setCommentLoading(false);
}

closeAddCommentModal.addEventListener(
    "click",
    closeCommentModal
);

cancelAddCommentModal.addEventListener(
    "click",
    closeCommentModal
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
        "focus:ring-danger/10"
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

    const requestId = commentRequestId.value.trim();
    const message = commentMessage.value.trim();

    if (!requestId) {
        window.toast?.error?.("Invalid service request.");
        return;
    }

    if (!message) {
        showCommentError("Please enter a comment.");
        return;
    }

    setCommentLoading(true);

    try {
        const response = await fetch(
            `/servicerequest/addcomment/${requestId}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to add comment."
            );
        }

        window.toast?.success?.(
            result.message || "Comment added successfully."
        );

        closeCommentModal();
    } catch (error) {
        console.error("Add comment error:", error);

        window.toast?.error?.(
            error.message || "Failed to add comment."
        );
    } finally {
        setCommentLoading(false);
    }
});

function setCommentLoading(isLoading) {
    submitCommentButton.disabled = isLoading;
    commentMessage.disabled = isLoading;

    submitCommentIcon.className = isLoading
        ? "fa-solid fa-spinner fa-spin text-xs"
        : "fa-solid fa-paper-plane text-xs";

    submitCommentText.textContent = isLoading
        ? "Adding Comment..."
        : "Add Comment";
}