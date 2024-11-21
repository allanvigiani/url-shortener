import { Pool } from 'pg';
import { JwtPayload } from 'jsonwebtoken';

declare global {

    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
