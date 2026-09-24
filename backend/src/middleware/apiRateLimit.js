import redisServices from "../services/redis/redisServices.js";
import { errorResponse } from "../utils/apiResponse.js";
import { redisKeys } from "../utils/redisKey.js";

const apiRateLimit = ({ limit = 100, windowSeconds = 15 * 60 } = {}) => {
  
  return async (req, res, next) => {
    try {
      const identifier = req.ip;

      const key = redisKeys.rateLimit.api(identifier);

      const count = await redisServices.incrementWithExpire(key, windowSeconds);

      if (count === null) {
        return next();
      }

      const remaining = Math.max(limit - count, 0);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);

      if (count > limit) {
        res.setHeader("Retry-After", windowSeconds);

        return errorResponse(res, {
          statusCode: 429,
          message: "Too many requests.Please try again later.",
          errors: "Rate limit exceeded. Please try again later.",
        });
      }

      return next();
    } catch (error) {
      console.error("API rate limit error:", error);

      return next();
    }
  };
};

export default apiRateLimit;
