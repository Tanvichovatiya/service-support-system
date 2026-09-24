import redisServices from "../services/redis/redisServices.js";
import { redisKeys } from "../utils/redisKey.js";

const loginRateLimit = ({ limit = 5, windowSeconds = 30 } = {}) => {
  return async (req, res, next) => {
    try {
      const { email } = req.body;
 
      const identifier = `${req.ip}:${email?.toLowerCase().trim()}`;

      const key = redisKeys.rateLimit.login(identifier);

      const count = await redisServices.incrementWithExpire(key, windowSeconds);
      console.log("count:", count);
      if (count === null) {
        return next();
      }

      const remaining = Math.max(limit - count, 0);

      res.setHeader("X-Login-RateLimit-Limit", limit);
      res.setHeader("X-Login-RateLimit-Remaining", remaining);

      if (count > limit) {
        res.setHeader("Retry-After", windowSeconds);

        return errorResponse(res, {
          statusCode: 429,
          message: "Too many login attempts.",
          errors: "Login attempt limit exceeded. Please try again later.",
        });
      }

      return next();
    } catch (error) {
      console.error("Login rate limit error:", error);

      return next();
    }
  };
};

export default loginRateLimit;
