import redisClient from "../../config/redis.js";

const redisServices = {
  get: async (key) => {
    try {
      if (!redisClient.isReady) {
        return null;
      }

      return await redisClient.get(key);
    } catch (error) {
      console.error(`Redis GET error [${key}]:`, error);
      return null;
    }
  },

  set: async (key, value, options = {}) => {
    try {
      if (!redisClient.isReady) {
        return false;
      }

      const data = typeof value === "string" ? value : JSON.stringify(value);

      await redisClient.set(key, data, options);

      return true;
    } catch (error) {
      console.error(`Redis SET error [${key}]:`, error);
      return false;
    }
  },

  delete: async (key) => {
    try {
      if (!redisClient.isReady) {
        return false;
      }
 
    
      await redisClient.del(key);

      return true;
    } catch (error) {
      console.error(`Redis DELETE error [${key}]:`, error);
      return false;
    }
  },

  getJson: async (key) => {
    try {
      if (!redisClient.isReady) {
        return null;
      }

      const data = await redisClient.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(`Redis GET JSON error [${key}]:`, error);
      return null;
    }
  },

  setJson: async (key, value, options = {}) => {
    try {
      if (!redisClient.isReady) {
        return false;
      }

      await redisClient.set(key, JSON.stringify(value), options);

      return true;
    } catch (error) {
      console.error(`Redis SET JSON error [${key}]:`, error);
      return false;
    }
  },

  exists: async (key) => {
    try {
      if (!redisClient.isReady) {
        return false;
      }

      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      console.error(`Redis EXISTS error [${key}]:`, error);
      return false;
    }
  },

  expire: async (key, seconds) => {
    try {
      if (!redisClient.isReady) {
        return false;
      }

      await redisClient.expire(key, seconds);

      return true;
    } catch (error) {
      console.error(`Redis EXPIRE error [${key}]:`, error);
      return false;
    }
  },

  increment: async (key) => {
    try {
      if (!redisClient.isReady) {
        return null;
      }

      return await redisClient.incr(key);
    } catch (error) {
      console.error(`Redis INCREMENT error [${key}]:`, error);
      return null;
    }
  },
  decrement: async (key) => {
    try {
      if (!redisClient.isReady) {
        return null;
      }
      return await redisClient.decr(key);
    } catch (error) {
      console.log("err:", error);
      throw error;
    }
  },

  incrementWithExpire: async (key, seconds) => {
  try {
      if (!redisClient.isReady) {
        return null;
      }

      const count = await redisClient.incr(key);

      if (count === 1) {
        await redisClient.expire(key, seconds);
      }

      return count;
    } catch (error) {
      console.error(`Redis INCR EXPIRE error [${key}]:`, error);
      return null;
    }
  },
  
};

export default redisServices;
