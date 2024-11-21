import database from '../../database/config/Database';

interface IUser {
    id: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

class UserRepository {

    async createUser(email: string, hash: string): Promise<IUser> {

        const conn = await database.generateConnection();

        const result = await conn.query(`
            INSERT INTO users (email, password)
            VALUES ($1, $2) RETURNING id;
        `, [email, hash]);

        return result.rows[0];
    }

    async findUserByEmail(email: string): Promise<IUser> {
        const conn = await database.generateConnection();
        const result = await conn.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async findUserById(id: string): Promise<IUser> {
        const conn = await database.generateConnection();
        const result = await conn.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }


    async deleteUserById( id: string ): Promise<IUser> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING id;
        `, [id]);

        return result.rows[0];
    }

    async updateUserById( id: string, password: string ): Promise<IUser> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            UPDATE users SET updated_at = NOW(), password = $1 WHERE id = $2 RETURNING id;
        `, [password, id]);

        return result.rows[0];
    }
}

export default UserRepository;
