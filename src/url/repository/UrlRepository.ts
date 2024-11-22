import database from '../../database/config/Database';
import { IUrl } from '../../models/Url';

export class UrlRepository {

    async createUrl(user_id: number | null, original_url: string, shortened_code: string, clicks: number): Promise<IUrl> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            INSERT INTO urls (user_id, original_url, shortened_code, clicks)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `, [user_id, original_url, shortened_code, clicks]);

        return result.rows[0];
    }

    async findByShortCode(shortened_code: string): Promise<IUrl | null> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            SELECT id, original_url, shortened_code, clicks FROM urls WHERE shortened_code = $1 AND deleted_at IS NULL;
        `, [shortened_code]);

        return result.rows[0];
    }

    async updateClicks(id: number, clicks: number): Promise<IUrl> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            UPDATE urls SET clicks = $1 WHERE id = $2 RETURNING clicks;
        `, [clicks, id]);

        return result.rows[0];
    }

    async findAllUrlsByUserId(user_id: string): Promise<IUrl[] | null> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            SELECT id, shortened_code AS shortened_url, clicks FROM urls WHERE user_id = $1 AND deleted_at IS NULL;
        `, [user_id]);

        return result.rows;
    }

    async deleteUrlById(id: string): Promise<IUrl> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            UPDATE urls SET deleted_at = NOW() WHERE id = $1 RETURNING id;
        `, [id]);

        return result.rows[0];
    }

    async findByUrlById(id: string): Promise<IUrl> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            SELECT id, user_id FROM urls WHERE id = $1 AND deleted_at IS NULL;
        `, [id]);

        return result.rows[0];
    }

    async updateUrl(id: string, original_url: string): Promise<IUrl> {
        const conn = await database.generateConnection();

        const result = await conn.query(`
            UPDATE urls SET updated_at = NOW(), original_url = $1 WHERE id = $2 RETURNING id;
        `, [original_url, id]);

        return result.rows[0];
    }

}
