import { Resolver, Query, Mutation, Args } from 'type-graphql';
import { Recipe as RecipeModel, recipeModel, userModel } from '@model/index';
import * as Types from '@generated/index';
import { ApolloError } from 'apollo-server-express';
import { DocumentType } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import { environment } from '@config/index';

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

  @Mutation((returns) => Types.TLoginResponse)
  async login(@Args() values: Types.TLoginArgs): Promise<Types.TLoginResponse> {
    try {
      const find = await userModel.findOne({ username: values.username });

      if (!find) {
        throw new ApolloError('Incorrect username');
      }

      const token = jwt.sign({ id: find._id }, environment.secretKey);

      return {
        data: {
          id: find._id,
          username: find.username,
          createdAt: find.createdAt,
          updatedAt: find.updatedAt,
        },
        token,
      };
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }
}
