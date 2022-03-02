import { ObjectType, Field, ArgsType } from 'type-graphql';
import { TUser } from '.';

@ObjectType()
export class Recipe {
  @Field()
  name: string;

  @Field()
  id: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field((type) => TUser, { nullable: true })
  owner?: TUser;
}

@ArgsType()
export class TAddRecipeArgs {
  @Field()
  name: string;
}

@ObjectType()
export class TDeleteRecipeResponse {
  @Field()
  message: string;
}

@ArgsType()
export class TDeleteArgs {
  @Field()
  id: string;
}

@ArgsType()
export class TUpdateArgs {
  @Field()
  id: string;

  @Field()
  name: string;
}
