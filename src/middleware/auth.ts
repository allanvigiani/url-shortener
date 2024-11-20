import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    req.user = decodedToken;

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: 'Token expirado' });
    } else {
      res.status(401).json({ error: 'Token inválido' });
    }
    return;
  }

  next();
};

export default validateToken;
