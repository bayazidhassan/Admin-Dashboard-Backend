import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/AppError';
import { verifyAccessToken } from '../utils/jwt';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized');
  }

  const token = authorization.split(' ')[1];

  const decoded = verifyAccessToken(token);

  req.user = decoded;

  next();
};

export default authenticate;
