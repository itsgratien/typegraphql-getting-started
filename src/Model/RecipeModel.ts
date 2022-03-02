import {
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { User } from './UserModel';
export class Recipe {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, default: Date.now() })
  public createdAt: string;

  @prop({ required: true, default: Date.now() })
  public updatedAt: string;

  @prop({ required: true, ref: () => User })
  public owner: Ref<User, string>;
}

export const recipeModel = getModelForClass(Recipe);
