

export const getInitials = (firstname = "", lastname = "") => {
  const first = firstname.trim().charAt(0);
  const last = lastname.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
};
