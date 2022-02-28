import { Resolver, Query, ObjectType, Field } from 'type-graphql';
import { recipeModel } from '@model/index';
import { Recipe } from '@generated/index';


@Resolver()
export class RecipeResolver {
  @Query((returns) => [Recipe])
  async getRecipes(): Promise<Recipe[]> {
    const d = await recipeModel.find({});
    return d;
  }
}
