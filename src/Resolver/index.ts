import { Resolver, Query, Mutation, Args, Authorized, Ctx } from 'type-graphql';
import { Recipe as RecipeModel, recipeModel, userModel } from '@model/index';
import * as Types from '@generated/index';
import { ApolloError } from 'apollo-server-express';
import { DocumentType } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import { environment } from '@config/index';

@Resolver()
export class RecipeResolver {
  @Authorized()
  @Query((returns) => [Types.Recipe])
  async getRecipes(): Promise<Types.Recipe[]> {
    try {
      const find = await recipeModel.find({}).populate({
        model: userModel,
        path: 'owner',
        select: '_id username createdAt updatedAt',
      });
      return find.map((item) => this.manageRecipe(item));
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @Authorized()
  @Mutation(() => Types.Recipe)
  async addRecipe(
    @Args() values: Types.TAddRecipeArgs,
    @Ctx() ctx: Types.TContextType
  ): Promise<Types.Recipe> {
    try {
      const create = await recipeModel.create({
        name: values.name,
        owner: ctx.user.id,
      });
      const d = this.manageRecipe(create);

      return {
        id: d.id,
        name: d.name,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @Authorized()
  @Mutation(() => Types.Recipe)
  async updateRecipe(
    @Args() value: Types.TUpdateArgs,
    @Ctx() ctx: Types.TContextType
  ) {
    try {
      const update = await recipeModel.findOneAndUpdate(
        { $and: [{ _id: value.id }, { owner: ctx.user.id }] },
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

  @Authorized()
  @Mutation((returns) => Types.TDeleteRecipeResponse)
  async deleteRecipe(
    @Args() { id }: Types.TDeleteArgs,
    @Ctx() ctx: Types.TContextType
  ): Promise<Types.TDeleteRecipeResponse> {
    try {
      await recipeModel.deleteOne({ _id: id, owner: ctx.user.id });
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
      owner:
        typeof values.owner === 'object'
          ? {
              username: values.owner.username,
              createdAt: values.owner.createdAt,
              updatedAt: values.owner.updatedAt,
              id: 'id',
            }
          : undefined,
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
