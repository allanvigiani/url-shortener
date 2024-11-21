import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'express';

const optionalValidateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    (req as any).user = undefined;
    return next();
  }

  const [, token] = authorizationHeader.split(' ');

  if (!token) {
    (req as any).user = undefined;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET as string) as JwtPayload;

    if (!decodedToken) {
      (req as any).user = undefined;
    } else {
      (req as any).user = decodedToken;
    }
  } catch (error: any) {

    (req as any).user = undefined;
  }

  next();
};

export default optionalValidateToken;
