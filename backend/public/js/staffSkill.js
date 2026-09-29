
document.addEventListener("DOMContentLoaded", () => {
  const skillCheckboxes = document.querySelectorAll(".skill-checkbox");

  if (!skillCheckboxes.length) return;

  const updateSkillStyle = (checkbox) => {
    const skillCard = checkbox.closest(".skill-card");

    if (!skillCard) return;

    const skillLabel = skillCard.querySelector(".skill-label");

    if (!skillLabel) return;

    skillLabel.classList.toggle("text-brand", checkbox.checked);
    skillLabel.classList.toggle("font-semibold", checkbox.checked);
    skillLabel.classList.toggle("text-text-secondary", !checkbox.checked);
    skillLabel.classList.toggle("font-medium", !checkbox.checked);
  };

  skillCheckboxes.forEach((checkbox) => {
    updateSkillStyle(checkbox);

    checkbox.addEventListener("change", () => {
      updateSkillStyle(checkbox);
    });
  });
});