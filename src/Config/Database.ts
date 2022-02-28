import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    mongoose.connect('mongodb://localhost:27017/typeRecipe');
    return undefined;
  } catch (error) {
    throw error;
  }
};
