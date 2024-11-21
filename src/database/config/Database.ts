import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Extende o tipo globalThis com uma nova propriedade customizada
declare global {
    var databaseConnection: Pool | undefined;
}

class Database {
    private async configureConnection(): Promise<Pool> {
        if (!globalThis.databaseConnection) {
            const connectionString = process.env.POSTGRES_URL;

            if (!connectionString) {
                throw new Error('A variável de ambiente POSTGRES_URL não foi definida.');
            }

            globalThis.databaseConnection = new Pool({
                connectionString,
                ssl: {
                    rejectUnauthorized: false,
                },
            });
        }
        return globalThis.databaseConnection;
    }

    public async generateConnection(): Promise<Pool> {
        return this.configureConnection();
    }
}

const database = new Database();
export default database;
