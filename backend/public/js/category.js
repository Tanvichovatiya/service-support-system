const modal = document.getElementById("categoryModal");
const form = document.getElementById("categoryForm");

const modalTitle = document.getElementById("categoryModalTitle");
const modalSubtitle = document.getElementById("categoryModalSubtitle");
const modalIcon = document.getElementById("categoryModalIcon");

const categoryId = document.getElementById("categoryId");
const categoryName = document.getElementById("categoryName");
const categoryDescription = document.getElementById("categoryDescription");
const categoryStatus = document.getElementById("categoryStatus");

const categoryStatusWrapper = document.getElementById(
    "categoryStatusWrapper"
);

const categoryRequestsWrapper = document.getElementById(
    "categoryRequestsWrapper"
);

const categoryTotalRequests = document.getElementById(
    "categoryTotalRequests"
);

const modalLoading = document.getElementById("categoryModalLoading");
const formFooter = document.getElementById("categoryFormFooter");
const saveCategoryText = document.getElementById("saveCategoryText");

const closeModalButton = document.getElementById("closeCategoryModal");
const cancelModalButton = document.getElementById("cancelCategoryModal");
const openAddButton = document.getElementById("openAddCategory");

const categoryView = document.getElementById("categoryView");

const viewCategoryName = document.getElementById("viewCategoryName");

const viewCategoryDescription = document.getElementById(
    "viewCategoryDescription"
);

const viewCategoryStatus = document.getElementById("viewCategoryStatus");

const viewCategoryStatusIcon = document.getElementById(
    "viewCategoryStatusIcon"
);

const viewCategoryRequests = document.getElementById(
    "viewCategoryRequests"
);

const openModal = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.body.classList.add("overflow-hidden");
};

const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");

    resetModal();
};

const resetModal = () => {
    form.reset();

    categoryId.value = "";
    categoryName.value = "";
    categoryDescription.value = "";
    categoryStatus.checked = true;

    categoryName.disabled = false;
    categoryDescription.disabled = false;
    categoryStatus.disabled = false;

    formFooter.classList.remove("hidden");

    categoryStatusWrapper.classList.remove("hidden");

    categoryRequestsWrapper.classList.add("hidden");

    modalLoading.classList.add("hidden");

    form.classList.remove("hidden");

    if (categoryView) {
        categoryView.classList.add("hidden");
    }

    if (viewCategoryName) {
        viewCategoryName.textContent = "";
    }

    if (viewCategoryDescription) {
        viewCategoryDescription.textContent = "";
    }

    if (viewCategoryStatus) {
        viewCategoryStatus.textContent = "";
    }

    if (viewCategoryRequests) {
        viewCategoryRequests.textContent = "0";
    }
};

const openAddCategory = () => {
    resetModal();
    openModal();

    modalTitle.textContent = "Add Category";
    modalSubtitle.textContent = "Create a new service category";

    modalIcon.className = "fa-solid fa-plus";

    saveCategoryText.textContent = "Create Category";
};

const openViewCategory = async (id) => {
    resetModal();
    openModal();

    modalTitle.textContent = "Category Details";
    modalSubtitle.textContent = "View service category information";

    modalIcon.className = "fa-solid fa-eye";

    form.classList.add("hidden");

    formFooter.classList.add("hidden");

    modalLoading.classList.remove("hidden");

    try {
        const response = await fetch(`/admin/category/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to load category"
            );
        }

        const category = result.data;

        if (viewCategoryName) {
            viewCategoryName.textContent = category.name || "—";
        }

        if (viewCategoryDescription) {
            viewCategoryDescription.textContent =
                category.description || "No description available";
        }

        if (viewCategoryRequests) {
            viewCategoryRequests.textContent =
                category.totalRequests ?? 0;
        }

        const isActive = Boolean(category.isActive);

        if (viewCategoryStatus) {
            viewCategoryStatus.textContent = isActive
                ? "Active"
                : "Inactive";

            viewCategoryStatus.classList.remove(
                "text-success",
                "text-danger"
            );

            viewCategoryStatus.classList.add(
                isActive ? "text-success" : "text-danger"
            );
        }

        if (viewCategoryStatusIcon) {
            viewCategoryStatusIcon.className = isActive
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-circle-xmark";

            viewCategoryStatusIcon.classList.remove(
                "text-success",
                "text-danger"
            );

            viewCategoryStatusIcon.classList.add(
                isActive ? "text-success" : "text-danger"
            );
        }

        if (categoryView) {
            categoryView.classList.remove("hidden");
        }

        modalLoading.classList.add("hidden");
    } catch (error) {
        console.error("View category error:", error);

        closeModal();

        window.toast.error(
            error.message || "Unable to load category"
        );
    }
};

const openEditCategory = async (id) => {
    resetModal();
    openModal();

    modalTitle.textContent = "Edit Category";
    modalSubtitle.textContent = "Update category information";

    modalIcon.className = "fa-solid fa-pen";

    saveCategoryText.textContent = "Save Changes";

    modalLoading.classList.remove("hidden");

    form.classList.add("hidden");

    try {
        const response = await fetch(`/admin/category/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to load category"
            );
        }

        const category = result.data;

        categoryId.value = category._id || "";

        categoryName.value = category.name || "";

        categoryDescription.value =
            category.description || "";

        categoryStatus.checked = Boolean(category.isActive);

        categoryName.disabled = false;
        categoryDescription.disabled = false;
        categoryStatus.disabled = false;

        categoryRequestsWrapper.classList.add("hidden");

        modalLoading.classList.add("hidden");

        form.classList.remove("hidden");
    } catch (error) {
        console.error("Edit category error:", error);

        closeModal();

        window.toast.error(
            error.message || "Unable to load category"
        );
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = categoryId.value.trim();
     console.log("edit:",id)
    const isEdit = Boolean(id);

    const name = categoryName.value.trim();

    const description = categoryDescription.value.trim();

    const nameError = document.getElementById(
        "categoryNameError"
    );

    if (!name) {
        nameError.textContent =
            "Category name is required.";

        nameError.classList.remove("hidden");

        categoryName.focus();

        return;
    }

    nameError.classList.add("hidden");

    const data = {
        name,
        description,
        isActive: categoryStatus.checked,
    };

    const url = isEdit
        ? `/admin/category/${id}/edit`
        : "/admin/category/create";

    const method = isEdit ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
      
        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to save category"
            );
        }

        const successMessage =
            result.message ||
            (isEdit
                ? "Category updated successfully"
                : "Category created successfully");

        window.toast.success(successMessage);

        closeModal();

        setTimeout(() => {
            window.location.reload();
        }, 700);
    } catch (error) {
        console.error("Category save error:", error);

        window.toast.error(
            error.message || "Unable to save category"
        );
    }
});

if (openAddButton) {
    openAddButton.addEventListener(
        "click",
        openAddCategory
    );
}

document.querySelectorAll(".view-category-btn")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;

            if (!id) {
                window.toast.error("Invalid category ID");
                return;
            }

            openViewCategory(id);
        });
    });

document.querySelectorAll(".edit-category-btn")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;

            if (!id) {
                window.toast.error("Invalid category ID");
                return;
            }

            openEditCategory(id);
        });
    });

if (closeModalButton) {
    closeModalButton.addEventListener(
        "click",
        closeModal
    );
}

if (cancelModalButton) {
    cancelModalButton.addEventListener(
        "click",
        closeModal
    );
}

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