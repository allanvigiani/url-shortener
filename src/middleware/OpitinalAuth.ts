import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IRequest } from '../models/Request';
import 'express';

const optionalValidateToken = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        req.user = undefined;
        return next();
    }

    const [, token] = authorizationHeader.split(' ');

    if (!token) {
        req.user = undefined;
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.AUTH_SECRET as string) as JwtPayload;

        if (!decodedToken) {
            req.user = undefined;
        } else {
            req.user = {
                id: decodedToken.id as string,
                payload: {
                    id: decodedToken.id as string,
                    email: decodedToken.email as string,
                },
            };
        }
    } catch (error) {
        req.user = undefined;
    }

    next();
};

export default optionalValidateToken;
