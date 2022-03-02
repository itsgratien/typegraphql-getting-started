import { getModelForClass, prop } from '@typegoose/typegoose';
export class Recipe {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, default: Date.now() })
  public createdAt: string;

  @prop({ required: true, default: Date.now() })
  public updatedAt: string;
}

export const recipeModel = getModelForClass(Recipe);
