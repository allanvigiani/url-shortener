import { Request } from 'express';

export interface IRequest extends Request {
    body: Partial<IBody>;
    params: Partial<IParams>;
    user?: IUser;
}

interface IBody {
    email: string;
    password: string;
    original_url: string;
}

interface IParams {
    user_id: string;
    url_id: string;
}

interface IUser {
    payload: IPayload;
    id: string;
}

interface IPayload {
    id: string;
    email: string;
}
