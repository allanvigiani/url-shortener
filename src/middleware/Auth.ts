import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IRequest } from '../models/Request';

const validateToken = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  const [, token] = authorizationHeader.split(' ');

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET as string) as JwtPayload;

    if (!decodedToken) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    req.user = {
      id: decodedToken.id as string,
      payload: {
        id: decodedToken.id as string,
        email: decodedToken.email as string,
      },
    };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expirado' });
    } else {
      res.status(401).json({ error: 'Token inválido' });
    }
    return;
  }

  next();
};

export default validateToken;
