
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#editStaffForm");

  if (!form) return;


  const skillCheckboxes = form.querySelectorAll(".skill-checkbox");

  const updateSkillStyle = (checkbox) => {
    const label = checkbox.closest("label");

    if (!label) return;

    const skillLabel =
      label.querySelector(".skill-label");

    if (!skillLabel) return;

    skillLabel.classList.toggle("text-brand",checkbox.checked);

    skillLabel.classList.toggle("font-semibold",checkbox.checked);

    skillLabel.classList.toggle("text-text-secondary",!checkbox.checked);

    skillLabel.classList.toggle("font-medium",!checkbox.checked);
  };


  skillCheckboxes.forEach((checkbox) => {
    updateSkillStyle(checkbox);

    checkbox.addEventListener("change", () => {
      updateSkillStyle(checkbox);
    });
  });

  const statusCheckbox =form.querySelector("#staffStatus");

  const statusText =form.querySelector("#staffStatusTitle");

  const statusDescription =form.querySelector("#staffStatusDescription");


  const updateStatus = () => {
    if (!statusCheckbox) return;

    const isActive =statusCheckbox.checked;

    if (statusText) {
      statusText.textContent = isActive? "Active Staff": "Inactive Staff";
    }

    if (statusDescription) {
      statusDescription.textContent = isActive
        ? "Staff can access the system and receive service requests."
        : "Staff cannot access the system or receive service requests.";
    }
  };


  if (statusCheckbox) {
    updateStatus();
    statusCheckbox.addEventListener("change",updateStatus);
  }


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const selectedSkills =form.querySelectorAll(".skill-checkbox:checked");


    if (selectedSkills.length === 0) {
      showToast("Please select at least one skill.","error");
      return;
    }



    const staffId =form.dataset.staffId;


    if (!staffId) {
      showToast("Staff ID is missing.","error");
      return;
    }


    const firstname =form.querySelector("#firstname").value.trim();
    const lastname =form.querySelector("#lastname").value.trim();
    const gender =form.querySelector("#gender").value;
    const employeeId =form.querySelector("#employeeId").value.trim();
    const department =form.querySelector("#department").value;
    const skills =Array.from(selectedSkills).map((checkbox) => checkbox.value);
    const isActive =statusCheckbox? statusCheckbox.checked : false;

    const data = {
      firstname,
      lastname,
      gender,
      employeeId,
      department,
      skills,
      isActive,
    };


  

    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );

    const buttonText =
      submitButton?.querySelector(
        "[data-submit-text]"
      );


    if (submitButton) {
      submitButton.disabled = true;

      submitButton.classList.add(
        "opacity-70",
        "cursor-not-allowed"
      );
    }

    if (buttonText) {
      buttonText.textContent = "Saving...";
    }



    try {

      const response = await fetch(
        `/admin/staff/${staffId}/edit`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(data),
        }
      );


      const result =
        await response.json();



      if (!response.ok || !result.success) {

        showToast(
          result.message ||
            "Failed to edit staff.",
          "error"
        );

        return;
      }


      showToast(
        result.message ||
          "Staff edited successfully.",
        "success"
      );


      setTimeout(() => {
        window.location.href =
          "/admin/staff";
      }, 1000);


    } catch (error) {

      console.error(
        "Edit staff error:",
        error
      );

      showToast(
        "Something went wrong. Please try again.",
        "error"
      );

    } finally {

      if (submitButton) {
        submitButton.disabled = false;

        submitButton.classList.remove(
          "opacity-70",
          "cursor-not-allowed"
        );
      }

      if (buttonText) {
        buttonText.textContent =
          "Save Changes";
      }
    }
  });


  function showToast(
    message,
    type = "success"
  ) {

    if (
      window.toast &&
      typeof window.toast[type] ===
        "function"
    ) {
      window.toast[type](message);
      return;
    }

    console.error(
      "Toast:",
      message
    );
  }
});
