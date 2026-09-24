document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("viewCommentModal");

    const closeModalButton = document.getElementById("closeViewCommentModal");

    const closeModalFooterButton = document.getElementById( "closeViewCommentModalFooter");

    const retryButton = document.getElementById( "retryCommentsButton");

    const requestTitle = document.getElementById("viewCommentRequestTitle");

    const commentsLoading = document.getElementById("commentsLoading");

    const commentsEmpty = document.getElementById("commentsEmpty");

    const commentsError = document.getElementById("commentsError");

    const commentsErrorMessage = document.getElementById(
        "commentsErrorMessage"
    );

    const commentsList = document.getElementById(
        "commentsList"
    );

    const commentCount = document.getElementById(
        "commentCount"
    );

    const DOWNLOAD_ATTACHMENT_URL = "/attachment/download";

    let currentRequestId = null;

    function openModal() {
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        document.body.classList.add("overflow-hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.classList.remove("flex");

        document.body.classList.remove("overflow-hidden");

        currentRequestId = null;
    }

    function resetModalState() {
        commentsLoading.classList.remove("hidden");

        commentsEmpty.classList.add("hidden");
        commentsError.classList.add("hidden");
        commentsList.classList.add("hidden");

        commentsList.innerHTML = "";

        commentsErrorMessage.textContent = "Please try again.";
        commentCount.textContent = "0 comments";
    }

    function showLoading() {
        commentsLoading.classList.remove("hidden");

        commentsEmpty.classList.add("hidden");
        commentsError.classList.add("hidden");
        commentsList.classList.add("hidden");
    }

    function showEmpty() {
        commentsLoading.classList.add("hidden");

        commentsEmpty.classList.remove("hidden");
        commentsError.classList.add("hidden");
        commentsList.classList.add("hidden");
    }

    function showError(message = "Please try again.") {
        commentsLoading.classList.add("hidden");

        commentsEmpty.classList.add("hidden");
        commentsError.classList.remove("hidden");
        commentsList.classList.add("hidden");

        commentsErrorMessage.textContent = message;
    }

    function showCommentsList() {
        commentsLoading.classList.add("hidden");

        commentsEmpty.classList.add("hidden");
        commentsError.classList.add("hidden");
        commentsList.classList.remove("hidden");
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatCommentDate(date) {
        if (!date) {
            return "Unknown date";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Unknown date";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function getUserName(user) {
        if (!user) {
            return "Unknown User";
        }

        const firstName = user.firstname || "";
        const lastName = user.lastname || "";

        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || "Unknown User";
    }

    function getUserInitials(user) {
        const name = getUserName(user);

        if (name === "Unknown User") {
            return "U";
        }

        return name
            .split(" ")
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase();
    }

    function renderAvatar(user) {
        if (user?.profilePic) {
            return `
                <img
                    src="${escapeHtml(user.profilePic)}"
                    alt="${escapeHtml(getUserName(user))}"
                    class="h-10 w-10 shrink-0 rounded-full object-cover"
                />
            `;
        }

        return `
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand"
            >
                ${escapeHtml(getUserInitials(user))}
            </div>
        `;
    }

    function formatFileSize(size) {
        if (!size || Number(size) <= 0) {
            return "";
        }

        const bytes = Number(size);

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }

        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }

    function getFileIcon(mimeType) {
        if (!mimeType) {
            return "fa-file";
        }

        if (mimeType.startsWith("image/")) {
            return "fa-file-image";
        }

        if (mimeType === "application/pdf") {
            return "fa-file-pdf";
        }

        if (
            mimeType.includes("word") ||
            mimeType.includes("document")
        ) {
            return "fa-file-word";
        }

        if (
            mimeType.includes("excel") ||
            mimeType.includes("spreadsheet")
        ) {
            return "fa-file-excel";
        }

        if (mimeType.startsWith("video/")) {
            return "fa-file-video";
        }

        if (mimeType.startsWith("audio/")) {
            return "fa-file-audio";
        }

        if (mimeType.includes("zip")) {
            return "fa-file-zipper";
        }

        return "fa-file";
    }

    function renderAttachment(attachment) {
        if (!attachment?._id) {
            return "";
        }

        const attachmentId = attachment._id;

        const fileName =
            attachment.originalName ||
            attachment.fileName ||
            "Attachment";

        const fileSize = formatFileSize(attachment.size);

        const fileIcon = getFileIcon(
            attachment.mimeType
        );

        return `
            <div
                class="flex items-center gap-3 rounded-xl border border-border bg-surface-soft p-3"
            >
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
                >
                    <i class="fa-solid ${fileIcon} text-sm"></i>
                </div>

                <div class="min-w-0 flex-1">
                    <p
                        class="truncate text-sm font-medium text-text-primary"
                        title="${escapeHtml(fileName)}"
                    >
                        ${escapeHtml(fileName)}
                    </p>

                    ${
                        fileSize
                            ? `
                                <p class="mt-0.5 text-xs text-text-muted">
                                    ${escapeHtml(fileSize)}
                                </p>
                            `
                            : ""
                    }
                </div>

                <button
                    type="button"
                    class="download-comment-attachment flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition hover:bg-brand/10 hover:text-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
                    data-attachment-id="${escapeHtml(
                        attachmentId
                    )}"
                    data-file-name="${escapeHtml(fileName)}"
                    aria-label="Download ${escapeHtml(fileName)}"
                    title="Download attachment"
                >
                    <i class="fa-solid fa-download text-sm"></i>
                </button>
            </div>
        `;
    }

    function renderAttachments(attachments) {
        if (
            !Array.isArray(attachments) ||
            attachments.length === 0
        ) {
            return "";
        }

        const attachmentItems = attachments
            .map((attachment) =>
                renderAttachment(attachment)
            )
            .join("");

        if (!attachmentItems) {
            return "";
        }

        return `
            <div class="mt-3 space-y-2">
                <p
                    class="text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                    Attachments
                </p>

                <div class="space-y-2">
                    ${attachmentItems}
                </div>
            </div>
        `;
    }

    function renderComment(comment) {
        const user = comment.user;

        const userName = getUserName(user);

        const role = user?.role
            ? user.role.replace("_", " ").toUpperCase()
            : "USER";

        const email = user?.email || "";

        const message = comment.message || "";

        return `
            <div
                class="rounded-xl border border-border bg-surface-soft p-4 transition hover:border-border-dark"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 items-center gap-3">
                        ${renderAvatar(user)}

                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <p
                                    class="truncate text-sm font-semibold text-text-primary"
                                >
                                    ${escapeHtml(userName)}
                                </p>

                                <span
                                    class="rounded-md bg-info-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-info"
                                >
                                    ${escapeHtml(role)}
                                </span>
                            </div>

                            ${
                                email
                                    ? `
                                        <p
                                            class="mt-0.5 truncate text-xs text-text-muted"
                                        >
                                            ${escapeHtml(email)}
                                        </p>
                                    `
                                    : ""
                            }
                        </div>
                    </div>

                    <time
                        class="shrink-0 text-[11px] font-medium text-text-muted"
                        datetime="${escapeHtml(
                            comment.createdAt
                        )}"
                    >
                        ${escapeHtml(
                            formatCommentDate(
                                comment.createdAt
                            )
                        )}
                    </time>
                </div>

                ${
                    message
                        ? `
                            <div
                                class="mt-4 rounded-lg border border-border-light bg-surface px-3.5 py-3"
                            >
                                <p
                                    class="whitespace-pre-wrap break-words text-sm leading-6 text-text-secondary"
                                >
                                    ${escapeHtml(message)}
                                </p>
                            </div>
                        `
                        : ""
                }

                ${renderAttachments(comment.attachments)}
            </div>
        `;
    }

    function renderComments(comments) {
        if (
            !Array.isArray(comments) ||
            comments.length === 0
        ) {
            commentCount.textContent = "0 comments";

            showEmpty();

            return;
        }

        commentCount.textContent =
            comments.length === 1
                ? "1 comment"
                : `${comments.length} comments`;

        commentsList.innerHTML = comments
            .map((comment) => renderComment(comment))
            .join("");

        showCommentsList();
    }

    async function loadComments(reqid) {
        showLoading();

        try {
            const response = await fetch(
                `/servicerequest/viewcomment/${reqid}/`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                        "Unable to load comments."
                );
            }

            const comments =
                result?.data?.comments || [];

            console.log("view comment:", comments);

            renderComments(comments);
        } catch (error) {
            console.error(
                "Failed to load comments:",
                error
            );

            showError(
                error.message ||
                    "Unable to load comments. Please try again."
            );
        }
    }

    async function downloadAttachment(
        attachmentId,
        fileName,
        button
    ) {
        if (!attachmentId) {
            return;
        }

        const originalContent = button.innerHTML;

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin text-sm"></i>
        `;

        try {
            const response = await fetch(
                `${DOWNLOAD_ATTACHMENT_URL}/${encodeURIComponent(
                    attachmentId
                )}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                let errorMessage =
                    "Unable to download attachment.";

                try {
                    const result =
                        await response.json();

                    errorMessage =
                        result?.message ||
                        errorMessage;
                } catch {
                    errorMessage =
                        "Unable to download attachment.";
                }

                throw new Error(errorMessage);
            }

            const blob = await response.blob();

            const blobUrl =
                window.URL.createObjectURL(blob);

            const downloadLink =
                document.createElement("a");

            downloadLink.href = blobUrl;
            downloadLink.download =
                fileName || "attachment";

            document.body.appendChild(downloadLink);

            downloadLink.click();

            downloadLink.remove();

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(
                "Attachment download error:",
                error
            );

            if (typeof window.toast !== "undefined") {
                window.toast.error(
                    error.message ||
                        "Unable to download attachment."
                );
            } else {
                alert(
                    error.message ||
                        "Unable to download attachment."
                );
            }
        } finally {
            button.disabled = false;
            button.innerHTML = originalContent;
        }
    }

    function getRequestTitle(button) {
        const row = button.closest("tr");

        if (!row) {
            return "Service Request";
        }

        const titleCell = row.querySelector(
            "td:first-child"
        );

        return (
            titleCell?.textContent?.trim() ||
            "Service Request"
        );
    }

    async function handleViewComments(button) {
        const requestId = button.dataset.id;

        if (!requestId) {
            return;
        }

        currentRequestId = requestId;

        const title = getRequestTitle(button);

        requestTitle.textContent = title;

        resetModalState();

        openModal();

        await loadComments(requestId);
    }

    document.addEventListener("click", (event) => {
        const viewCommentsButton =
            event.target.closest(
                ".view-comments-btn"
            );

        if (viewCommentsButton) {
            handleViewComments(
                viewCommentsButton
            );

            return;
        }

        const downloadButton =
            event.target.closest(
                ".download-comment-attachment"
            );

        if (!downloadButton) {
            return;
        }

        const attachmentId =
            downloadButton.dataset.attachmentId;

        const fileName =
            downloadButton.dataset.fileName;

        downloadAttachment(
            attachmentId,
            fileName,
            downloadButton
        );
    });

    closeModalButton?.addEventListener(
        "click",
        closeModal
    );

    closeModalFooterButton?.addEventListener(
        "click",
        closeModal
    );

    retryButton?.addEventListener("click", () => {
        if (!currentRequestId) {
            return;
        }

        loadComments(currentRequestId);
    });

    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (!modal.classList.contains("hidden")) {
            closeModal();
        }
    });
});