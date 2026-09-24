

import bcrypt from 'bcryptjs';

export const comparepassword=async(pass,hashedpass)=>{
  return await bcrypt.compare(pass,hashedpass)
}

