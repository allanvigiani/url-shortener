// import { database } from './database';

interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    address?: string;
    contact_phone?: string;
    cpf?: string;
    created_at?: Date;
}

class UserRepository {

    async createUser(data: IUser): Promise<IUser> {
        // const { name, email, password, address, contact_phone, created_at } = data;

        // const conn = await database.generateConnection();

        // const result = await conn.query(`
        //     INSERT INTO users (name, email, password, address, contact_phone, created_at)
        //     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
        // `, [name, email, password, address, contact_phone, created_at]);

        // return result.rows[0];
        return data;
    }

}

export default UserRepository;
