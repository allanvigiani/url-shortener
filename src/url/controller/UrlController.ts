import { Request, Response } from 'express';
import UrlRepository from '../repository/UrlRepository';
import dotenv from 'dotenv';

dotenv.config();

interface IRequest {
    params: { url_id: any; };
    body: {
        original_url: string;
    }
    user: {
        payload: any;
        id: string;
    }
}

export class UrlController {
    private urlRepository: UrlRepository;
    private baseUrl: string;

    constructor(urlRepository: UrlRepository) {
        this.urlRepository = urlRepository;
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3001/url';
    }

    public async createUrl(req: IRequest, res: Response): Promise<void> {
        try {
            const { original_url: originalUrl } = req?.body;

            const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/;
            if (!originalUrl || !urlRegex.test(originalUrl)) {
                res.status(400).json({ error: 'Url inválida.' });
                return;
            }

            const shortCode = this.generateShortUrl();

            let userId: string | null = null;

            if (req?.user) {
                const user = req?.user;

                if (typeof user?.payload.id !== 'string' && 'id' in user?.payload) {
                    userId = user?.payload?.id;
                } else {
                    res.status(400).json({ error: 'Usuário inválido.' });
                    return;
                }
            }

            const clicks = 0;

            await this.urlRepository.createUrl(userId, originalUrl, shortCode, clicks);

            res.status(201).json({
                message: 'Url encurtada com sucesso!',
                original_url: originalUrl,
                short_url: `${this.baseUrl}/${shortCode}`,
            });
        } catch (error: any) {
            res.status(500).json({ error: `Erro ao criar url encurtada, ${error.message}` });
        }
    }

    public async redirectUrl(req: Request, res: Response): Promise<void> {
        try {

            const { shortened_code: shortenedCode } = req.params;

            if (!shortenedCode) {
                res.status(400).json({ error: 'Código não fornecido.' });
                return;
            }

            const urlData = await this.urlRepository.findByShortCode(shortenedCode);
            if (!urlData) {
                res.status(404).json({ error: 'URL não encontrada ou deletada.' });
                return;
            }

            const clicks = urlData.clicks + 1;
            await this.urlRepository.updateClicks(urlData?.id, clicks);

            res.redirect(urlData.original_url);
        } catch (error: any) {
            res.status(500).json({ error: `Erro ao redirecionar usuário, ${error.message}` });
        }
    }

    public async listAllUrlsByUser(req: IRequest, res: Response): Promise<void> {
        try {

            const userId = (req.user as any)?.payload?.id;

            if (!userId) {
                res.status(400).json({ error: 'Usuário indisponível.' });
                return;
            }

            const urlList = await this.urlRepository.findAllUrlsByUserId(userId);
            if (!urlList) {
                res.status(404).json({ error: 'Nenhuma URL encontrada.' });
                return;
            }

            const newUrlList = urlList.map(item => ({
                ...item,
                shortened_url: `${process.env.BASE_URL}/${item?.shortened_url}`
            }));

            res.status(200).json({ informations: newUrlList });
        } catch (error: any) {
            res.status(500).json({ error: `Erro ao buscar Urls do usuário, ${error.message}` });
        }
    }

    public async deleteUrl(req: IRequest, res: Response): Promise<void> {
        try {

            const { url_id: urlId } = req.params;

            if (!urlId) {
                res.status(400).json({ error: 'Id da Url indisponível.' });
                return;
            }

            const userId = req.user?.payload?.id;

            const isTheUser = await this.urlRepository.findByUrlById(urlId);
            if (!isTheUser || isTheUser?.user_id !== userId) {
                res.status(403).json({ error: 'Não é possível apagar essa Url.' });
                return;
            }

            await this.urlRepository.deleteUrlById(urlId);

            res.status(200).json({ message: 'Url deletada com sucesso!' });
        } catch (error: any) {
            res.status(500).json({ error: `Erro ao deletar Url, ${error.message}` });
        }
    }

    public async updateUrl(req: IRequest, res: Response): Promise<void> {
        try {

            const { url_id: urlId } = req.params;
            const { original_url: originalUrl } = req.body;

            if (!urlId) {
                res.status(400).json({ error: 'Id da Url indisponível.' });
                return;
            }

            if (!originalUrl) {
                res.status(400).json({ error: 'URL original é obrigatória.' });
                return;
            }

            const userId = req.user?.payload?.id;

            const isTheUser = await this.urlRepository.findByUrlById(urlId);
            if (!isTheUser || isTheUser?.user_id !== userId) {
                res.status(403).json({ error: 'Não é possível editar essa Url.' });
                return;
            }

            await this.urlRepository.updateUrl(urlId, originalUrl);

            res.status(200).json({ message: 'Url atualizado com sucesso!' });
        } catch (error: any) {
            res.status(500).json({ error: `Erro ao atualizar Url, ${error.message}` });
        }
    }

    private generateShortUrl(): string {
        const shortCode = Math.random().toString(36).substring(2, 8);
        return `${shortCode}`;
    }

}
