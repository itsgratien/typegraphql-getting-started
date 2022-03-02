import mongoose from 'mongoose';
import { userModel } from '@model/index';
import { faker } from '@faker-js/faker';

export const dbConnect = async (): Promise<undefined> => {
  try {
    mongoose.connect('mongodb://localhost:27017/typeRecipe');
    return undefined;
  } catch (error) {
    throw error;
  }
};

export const createUser = async () => {
  await userModel.create({ username: faker.name.firstName().toLowerCase() });
};
