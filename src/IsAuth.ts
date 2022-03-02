import { AuthChecker } from 'type-graphql';
import { TContextType, User } from '@generated/index';
import jwt from 'jsonwebtoken';
import { environment } from '@config/index';
import { userModel } from '@model/index';

export const customAuthChecker: AuthChecker<TContextType> = async ({
  context,
}) => {
  const { req } = context;
  if (req && req.headers && req.headers.authorization) {
    const verify = verifyAuthToken(req.headers.authorization);
    if (verify) {
      const findUser = await userModel.findById(verify.id);
      if (findUser) {
        context.user = {
          id: String(findUser._id),
          username: findUser.username,
          createdAt: findUser.createdAt,
          updatedAt: findUser.updatedAt,
        };
        return true;
      }
    }
  }
  return false;
};

const verifyAuthToken = (token: string) => {
  const verify = jwt.verify(token, environment.secretKey);

  if (typeof verify === 'object') {
    return verify;
  }

  return undefined;
};
