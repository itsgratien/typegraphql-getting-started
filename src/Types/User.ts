import { ObjectType, ArgsType, Field } from 'type-graphql';
import { Request, Response } from 'express';

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

export interface TContextType {
  req: Request;
  res: Response;
  user: User;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
