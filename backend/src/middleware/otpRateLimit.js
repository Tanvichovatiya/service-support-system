import redisServices from "../services/redis/redisServices.js";
import { errorResponse } from "../utils/apiResponse.js";
import { redisKeys } from "../utils/redisKey.js";



const otpRateLimit = ({limit = 5,windowSeconds = 30} = {}) => {

  return async (req, res, next) => {
    try {
      const { email } = req.body;

      const identifier = `${req.ip}:${email?.toLowerCase().trim()}`;

      const key = redisKeys.rateLimit.otp(identifier);

      const count = await redisServices.incrementWithExpire(key,windowSeconds);

      if (count === null) {
        return next();
      }

      const remaining = Math.max(limit - count, 0);

      res.setHeader("X-OTP-RateLimit-Limit", limit);
      res.setHeader("X-OTP-RateLimit-Remaining",remaining);

      if (count > limit) {
        res.setHeader("Retry-After", windowSeconds);

        return errorResponse(res, {
          statusCode: 429,
          message: "Too many OTP verification attempts.",
          errors:
            "OTP verification limit exceeded. Please try again later.",
        });
      }

      return next();
    } catch (error) {
      console.error("OTP rate limit error:", error);

      return next();
    }
  };
};

export default otpRateLimit;