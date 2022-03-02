import { ObjectType, ArgsType, Field } from 'type-graphql';

@ArgsType()
export class TLoginArgs {
  @Field()
  username: string;
}

@ObjectType()
export class TUser {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class TLoginResponse {
  @Field()
  data: TUser;

  @Field()
  token: string;
}
