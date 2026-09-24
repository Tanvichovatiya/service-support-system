
const modal = document.getElementById("createRequestModal");

const openButton = document.getElementById("openCreateRequest");
const closeButton = document.getElementById("closeCreateRequestModal");
const cancelButton = document.getElementById("cancelCreateRequestModal");

const form = document.getElementById("createRequestForm");

const loading = document.getElementById("createRequestLoading");

const categorySelect = document.getElementById("requestCategoryId");
const titleInput = document.getElementById("requestTitle");
const descriptionInput = document.getElementById("requestDescription");
const prioritySelect = document.getElementById("requestPriority");

const titleCount = document.getElementById("requestTitleCount");

const createButton = document.getElementById("createRequestButton");
const createButtonIcon = document.getElementById("createRequestButtonIcon");
const createButtonText = document.getElementById("createRequestButtonText");




const CREATE_REQUEST_API =
    `/servicerequest/create`;

const ACTIVE_CATEGORIES_API =
    "/category/active";


openButton?.addEventListener("click", async () => {

    openModal();

    await loadActiveCategories();

});


closeButton?.addEventListener("click", closeModal);

cancelButton?.addEventListener("click", closeModal);



modal?.addEventListener("click", (event) => {

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



function openModal() {

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    resetForm();

}


function closeModal() {

    modal.classList.add("hidden");
    modal.classList.remove("flex");

    resetForm();

}


function resetForm() {

    form.reset();

    prioritySelect.value = "medium";

    clearErrors();

    titleCount.textContent = "0/200";

    setLoading(false);

}



async function loadActiveCategories() {

    categorySelect.innerHTML = `
        <option value="">
            Loading categories...
        </option>
    `;

    categorySelect.disabled = true;

    try {

        const response = await fetch(
            ACTIVE_CATEGORIES_API,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load categories"
            );

        }


        const categories =
            result.data?.categories ||
            result.data ||
            [];


        categorySelect.innerHTML = `
            <option value="">
                Select category
            </option>
        `;


        categories.forEach((category) => {

            const option =
                document.createElement("option");

            option.value = category._id;

            option.textContent =
                category.name;

            categorySelect.appendChild(option);

        });


        if (!categories.length) {

            categorySelect.innerHTML = `
                <option value="">
                    No active categories found
                </option>
            `;

        }

    } catch (error) {

        console.error(
            "Load active categories error:",
            error
        );


        categorySelect.innerHTML = `
            <option value="">
                Failed to load categories
            </option>
        `;


        window.toast?.error(
            error.message ||
            "Failed to load categories"
        );

    } finally {

        categorySelect.disabled = false;

    }

}


titleInput?.addEventListener("input", () => {

    titleCount.textContent =
        `${titleInput.value.length}/200`;

});



categorySelect?.addEventListener("change", () => {

    clearFieldError("requestCategoryId");

});


titleInput?.addEventListener("input", () => {

    clearFieldError("requestTitle");

});


descriptionInput?.addEventListener("input", () => {

    clearFieldError("requestDescription");

});


form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearErrors();

    const formData = {

        categoryId:
            categorySelect.value,

        title:
            titleInput.value.trim(),

        description:
            descriptionInput.value.trim(),

        priority:
            prioritySelect.value,

    };


    const isValid =
        validateForm(formData);


    if (!isValid) {
        return;
    }


    setLoading(true);


    try {

        const response = await fetch(
            CREATE_REQUEST_API,
            {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),
            }
        );


        const result =
            await response.json();



        if (!response.ok) {

         

            throw new Error(
                result.message ||
                "Failed to create service request"
            );

        }

        window.toast?.success(
            result.message ||
            "Service request created successfully"
        );


        closeModal();


        if (
            typeof window.loadRequests ===
            "function"
        ) {

            window.loadRequests();

        } else {

            window.location.reload();

        }


    } catch (error) {

        console.error(
            "Create request error:",
            error
        );


        window.toast?.error(
            error.message ||
            "Failed to create service request"
        );

    } finally {

        setLoading(false);

    }

});


function validateForm(data) {

    let valid = true;


    if (!data.categoryId) {

        showFieldError(
            "requestCategoryId",
            "Please select a service category."
        );

        valid = false;

    }


    if (!data.title) {

        showFieldError(
            "requestTitle",
            "Request title is required."
        );

        valid = false;

    } else if (data.title.length > 200) {

        showFieldError(
            "requestTitle",
            "Title cannot exceed 200 characters."
        );

        valid = false;

    }



    if (!data.description) {

        showFieldError(
            "requestDescription",
            "Description is required."
        );

        valid = false;

    }


    return valid;

}


// =========================================================
// SHOW FIELD ERROR
// =========================================================

function showFieldError(
    fieldId,
    message
) {

    const errorElement =
        document.getElementById(
            `${fieldId}Error`
        );

    const field =
        document.getElementById(fieldId);


    if (errorElement) {

        errorElement.textContent =
            message;

        errorElement.classList.remove(
            "hidden"
        );

    }


    if (field) {

        field.classList.add(
            "border-danger"
        );

        field.classList.remove(
            "border-input-border"
        );

    }

}


// =========================================================
// CLEAR FIELD ERROR
// =========================================================

function clearFieldError(fieldId) {

    const errorElement =
        document.getElementById(
            `${fieldId}Error`
        );

    const field =
        document.getElementById(fieldId);


    if (errorElement) {

        errorElement.textContent = "";

        errorElement.classList.add(
            "hidden"
        );

    }


    if (field) {

        field.classList.remove(
            "border-danger"
        );

        field.classList.add(
            "border-input-border"
        );

    }

}


// =========================================================
// CLEAR ALL ERRORS
// =========================================================

function clearErrors() {

    [
        "requestCategoryId",
        "requestTitle",
        "requestDescription",
    ].forEach((fieldId) => {

        clearFieldError(fieldId);

    });

}


// =========================================================
// LOADING STATE
// =========================================================

function setLoading(isLoading) {

    if (isLoading) {

        createButton.disabled = true;

        createButton.classList.add(
            "cursor-not-allowed",
            "opacity-70"
        );


        createButtonIcon.className =
            "fa-solid fa-spinner fa-spin text-xs";


        createButtonText.textContent =
            "Creating...";


        /*
         * Optional:
         * Show full loading section if you want it.
         *
         * loading.classList.remove("hidden");
         * loading.classList.add("flex");
         */

    } else {

        createButton.disabled = false;

        createButton.classList.remove(
            "cursor-not-allowed",
            "opacity-70"
        );


        createButtonIcon.className =
            "fa-solid fa-check text-xs";


        createButtonText.textContent =
            "Create Request";


        /*
         * Optional:
         * Hide full loading section.
         *
         * loading.classList.add("hidden");
         * loading.classList.remove("flex");
         */

    }

}