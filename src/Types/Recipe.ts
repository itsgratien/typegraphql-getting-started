import mongoose from 'mongoose';
import { ObjectType, Field } from 'type-graphql';

export interface TRecipeModel extends TRecipe {
  _id: mongoose.Types.ObjectId;
}

export interface TRecipe {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TRecipeResponse extends TRecipe {
  id: string;
}

@ObjectType()
export class Recipe {
  @Field()
  name: string;

  @Field()
  _id: string;
}