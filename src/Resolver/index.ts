import { Resolver, Query, Mutation, Args } from 'type-graphql';
import { Recipe as RecipeModel, recipeModel } from '@model/index';
import * as Types from '@generated/index';
import { ApolloError } from 'apollo-server-express';
import { DocumentType } from '@typegoose/typegoose';

@Resolver()
export class RecipeResolver {
  @Query((returns) => [Types.Recipe])
  async getRecipes(): Promise<Types.Recipe[]> {
    try {
      const find = await recipeModel.find({});
      return find.map((item) => this.manageRecipe(item));
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation(() => Types.Recipe)
  async addRecipe(@Args() values: Types.TAddRecipeArgs): Promise<Types.Recipe> {
    try {
      const create = await recipeModel.create(values);
      return this.manageRecipe(create);
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation(() => Types.Recipe)
  async updateRecipe(@Args() value: Types.TUpdateArgs) {
    try {
      const update = await recipeModel.findOneAndUpdate(
        { _id: value.id },
        {
          $set: { name: value.name, updatedAt: Date.now() },
        },
        { new: true }
      );
      return this.manageRecipe(update);
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation((returns) => Types.TDeleteRecipeResponse)
  async deleteRecipe(
    @Args() { id }: Types.TDeleteArgs
  ): Promise<Types.TDeleteRecipeResponse> {
    try {
      await recipeModel.deleteOne({ _id: id });
      return {
        message: 'Deleted',
      };
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  private manageRecipe(values: DocumentType<RecipeModel>) {
    return {
      id: values._id,
      name: values.name,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
    };
  }
}
