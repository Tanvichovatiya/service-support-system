
export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least 1 uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least 1 lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least 1 number.";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)) {
    return "Password must contain at least 1 symbol.";
  }

  return null;
};