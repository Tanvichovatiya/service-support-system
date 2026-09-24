const userModal = document.getElementById("userModal");
const openBtn = document.getElementById("openAddUserModal");
const closeBtn = document.getElementById("closeUserModal");
const cancelBtn = document.getElementById("cancelUserModal");

const userForm = document.getElementById("userForm");

const saveBtn = document.getElementById("saveUserButton");
const saveText = document.getElementById("saveUserText");
const saveLoader = document.getElementById("saveUserLoader");

const modalLoading = document.getElementById("userModalLoading");

const firstnameInput = document.getElementById("userFirstname");
const lastnameInput = document.getElementById("userLastname");
const emailInput = document.getElementById("userEmail");
const genderInput = document.getElementById("userGender");

const firstnameError = document.getElementById("userFirstnameError");
const lastnameError = document.getElementById("userLastnameError");
const emailError = document.getElementById("userEmailError");


function openModal() {
  if (!userModal) return;

  userModal.classList.remove("hidden");
  userModal.classList.add("flex");

  firstnameInput?.focus();
}


function closeModal() {
  if (!userModal) return;

  userModal.classList.add("hidden");
  userModal.classList.remove("flex");

  userForm?.reset();

  clearErrors();

  resetButton();
}



function clearErrors() {
  const errorElements = [
    firstnameError,
    lastnameError,
    emailError,
  ];

  errorElements.forEach((element) => {
    if (!element) return;

    element.textContent = "";
    element.classList.add("hidden");
  });

  const inputElements = [
    firstnameInput,
    lastnameInput,
    emailInput,
  ];

  inputElements.forEach((element) => {
    element?.classList.remove("border-danger");
  });
}



function showError(input, errorElement, message) {
  if (!input || !errorElement) return;

  input.classList.add("border-danger");

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}


function validateForm() {
  clearErrors();

  let isValid = true;

  const firstname = firstnameInput?.value.trim();
  const lastname = lastnameInput?.value.trim();
  const email = emailInput?.value.trim();

  if (!firstname) {
    showError(
      firstnameInput,
      firstnameError,
      "First name is required."
    );

    isValid = false;
  }

  if (!lastname) {
    showError(
      lastnameInput,
      lastnameError,
      "Last name is required."
    );

    isValid = false;
  }

  if (!email) {
    showError(
      emailInput,
      emailError,
      "Email is required."
    );

    isValid = false;
  } else if (!isValidEmail(email)) {
    showError(
      emailInput,
      emailError,
      "Please enter a valid email address."
    );

    isValid = false;
  }

  return isValid;
}



function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



function setLoading() {
  if (!saveBtn) return;

  saveBtn.disabled = true;

  saveText.textContent = "Creating...";
  saveLoader.classList.remove("hidden");

  modalLoading?.classList.remove("hidden");
  modalLoading?.classList.add("flex");
}



function resetButton() {
  if (!saveBtn) return;

  saveBtn.disabled = false;

  saveText.textContent = "Create User";
  saveLoader.classList.add("hidden");

  modalLoading?.classList.add("hidden");
  modalLoading?.classList.remove("flex");
}


openBtn?.addEventListener("click", (event) => {
  event.preventDefault();

  openModal();
});


closeBtn?.addEventListener("click", closeModal);



cancelBtn?.addEventListener("click", closeModal);



userModal?.addEventListener("click", (event) => {
  if (event.target === userModal) {
    closeModal();
  }
});



document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !userModal?.classList.contains("hidden")) {
    closeModal();
  }
});



firstnameInput?.addEventListener("input", () => {
  firstnameInput.classList.remove("border-danger");
  firstnameError?.classList.add("hidden");
});

lastnameInput?.addEventListener("input", () => {
  lastnameInput.classList.remove("border-danger");
  lastnameError?.classList.add("hidden");
});

emailInput?.addEventListener("input", () => {
  emailInput.classList.remove("border-danger");
  emailError?.classList.add("hidden");
});



userForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const data = {
    firstname: firstnameInput.value.trim(),
    lastname: lastnameInput.value.trim(),
    email: emailInput.value.trim(),
    gender: genderInput.value || null,
  };

  try {
    setLoading();

    const response = await fetch("/admin/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      window.toast.error(
        result.message || "Failed to create user."
      );

      return;
    }

    window.toast.success(
      result.message || "User created successfully."
    );

    closeModal();

    setTimeout(() => {
      window.location.reload();
    }, 1200);
  } catch (error) {
    console.error("Add User Error:", error);
   console.log("err:",error);
    window.toast.error(
      "Something went wrong. Please try again."
    );
  } finally {
    resetButton();
  }
});