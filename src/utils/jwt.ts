import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as JwtPayload;
};
