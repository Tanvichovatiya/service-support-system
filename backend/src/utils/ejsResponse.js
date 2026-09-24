
export const renderError = (
  res,
  {
    statusCode = 400,
    view,
    errors = {},
    formData = {},
    data = {},
  },
) => {
  return res.status(statusCode).render(view, {
    errors,
    formData,
    ...data,
  });
};


export const renderServerError = (
  res,
  {
    statusCode = 500,
    view,
    message = "Something went wrong.Server error",
    formData = {},
    data = {},
  },
) => {
  return res.status(statusCode).render(view, {
    errors: {
      general: {
        msg: message,
      },
    },
    formData,
    ...data,
  });
};


export const redirectSuccess = (
  res,
  {
    url,
    message,
  },
) => {
  const separator = url.includes("?") ? "&" : "?";

  return res.redirect(
    `${url}${separator}success=${encodeURIComponent(message)}`,
  );
};


export const redirectError = (
  res,
  {
    url,
    message,
  },
) => {
  const separator = url.includes("?") ? "&" : "?";

  return res.redirect(
    `${url}${separator}error=${encodeURIComponent(message)}`,
  );
};
