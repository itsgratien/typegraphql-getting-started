import { Prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export class User {
  @Prop({ required: true, unique: true })
  public username: string;

  @Prop({ required: true, default: Date.now() })
  public createdAt: string;

  @Prop({ required: true, default: Date.now() })
  public updatedAt: string;
}

export const userModel = getModelForClass(User);

export type TUserModel = DocumentType<typeof User>;
