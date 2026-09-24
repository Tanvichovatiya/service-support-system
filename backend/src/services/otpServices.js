import Otp from "../models/Otp.js";


const otpServices = {
  
  createotp: async (data = {}) => {
    try {
      const res = await Otp.create(data);
      if (!res) {
        throw new Error("failed to create otp");
      }
      return res;
    } catch (error) {
      console.log("err:", error);
      throw error
    }
  },

  //findone
 getdatabyfindOne: async (filter = {}) => {
    try {
      const res = await Otp.findOne(filter);
      if (!res) {
        throw new Error("failed to get data");
      }
      return res;
    } catch (error) {
      console.log("err:", error);
      throw error
    }
  },

 updateOne: async (filter={}, update = {}) => {
  try {
    const res = await Otp.updateOne(
      filter,  
      update
    );

    if (res.matchedCount === 0) {
      throw new Error("OTP not found");
    }

    return res;
  } catch (error) {
    console.log("err:", error);
    throw error;
  }
 },
};

export default otpServices;
