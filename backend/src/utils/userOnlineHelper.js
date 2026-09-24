
import { userServices } from "../services/userServices.js";

export const setUserOnline = async (userId) => {
  try {
    await userServices.updateOne(
      {_id:userId},
      {
        $set: {
          isOnline: true,
        },
      },
      { new: true }
    );

    // console.log(`User ${userId} is ONLINE`);
  } catch (error) {
    console.error("Set online error:", error);
  }
};

export const setUserOffline = async (userId) => {
  try {
    await userServices.updateOne(
      {_id:userId},
      {
        $set: {
          isOnline: false,
          lastSeen: new Date(),
        },
      },
      { new: true }
    );

    // console.log(`User ${userId} is OFFLINE`);
  } catch (error) {
    console.error("Set offline error:", error);
  }
};
