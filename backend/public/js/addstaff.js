
document.addEventListener("DOMContentLoaded", () => {
  const skillCheckboxes = document.querySelectorAll(".skill-checkbox");

  skillCheckboxes.forEach((checkbox) => {
    const badge = checkbox
      .closest(".skill-option")
      ?.querySelector(".skill-badge");

    if (!badge) return;

    const updateStyle = () => {
      if (checkbox.checked) {
        badge.classList.add(
          "border-brand",
          "bg-brand",
          "text-white"
        );

        badge.classList.remove(
          "border-border",
          "bg-surface",
          "text-text-secondary"
        );
      } else {
        badge.classList.remove(
          "border-brand",
          "bg-brand",
          "text-white"
        );

        badge.classList.add(
          "border-border",
          "bg-surface",
          "text-text-secondary"
        );
      }
    };

    // Existing selected skills
    updateStyle();

    // User can select/unselect multiple skills
    checkbox.addEventListener("change", updateStyle);
  });
});