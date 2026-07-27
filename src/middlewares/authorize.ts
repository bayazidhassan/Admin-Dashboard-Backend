import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/AppError';

const authorize =
  (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const hasPermission = requiredPermissions.every((permission) =>
      req.user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new AppError(403, 'Forbidden');
    }

    next();
  };

export default authorize;
