import bcrypt from 'bcryptjs';

export const hasheValue = async (value) => {
    return await bcrypt.hash(value, 10);
};