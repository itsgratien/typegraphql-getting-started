import dotenv from 'dotenv';
dotenv.config();

export const environment = {
  secretKey: process.env.SECRET_KEY || '',
};
