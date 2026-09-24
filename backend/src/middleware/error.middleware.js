import { errorResponse } from "../utils/apiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  console.log("err:", err);

  const statusCode = err.statusCode || 500;

  return errorResponse(res, {
    statusCode,
    message: err.message || "Server error",
    errors: err.errors || null,
  });
};

export default errorMiddleware;