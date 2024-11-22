export interface IUrl {
    shortened_url?: string;
    id?: string;
    user_id?: string | null;
    original_url?: string;
    shortened_code?: string;
    clicks?: number;
    craeted_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    
}