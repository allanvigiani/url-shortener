import { Pool } from 'pg';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    var databaseConnection: Pool | undefined;

    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
