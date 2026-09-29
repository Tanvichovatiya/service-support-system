


import mongoose from "mongoose";

export const toObjectId = (ids) => {
  if (Array.isArray(ids)) {
    return ids.map((id) => new mongoose.Types.ObjectId(id));
  }

  return new mongoose.Types.ObjectId(ids);
};