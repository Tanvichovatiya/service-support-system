

export const redisKeys = {
  category: {
    all: () => "categories:all",
    byId: (id) => `category:${id}`,
  },

  dashboard: {
    stats: () => "dashboard:stats",
  },

  user: {
    byId: (id) => `user:${id}`,
    session: (id) => `user:session:${id}`,
    recentlyViewed: (id) => `user:${id}:recently-viewed`,
  },

  notification: {
    unreadCount: (userId) =>
      `notifications:unread:${userId}`,
  },

  rateLimit: {
    login: (identifier) =>
      `rate-limit:login:${identifier}`,

    
    otp: (identifier) =>
      `rate-limit:otp:${identifier}`,

    api: (identifier) =>
      `rate-limit:api:${identifier}`,
  },
};