import { Response } from 'express';

interface SendResponse<T> {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
}: SendResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
