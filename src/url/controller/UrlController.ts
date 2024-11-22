import { Request, Response } from 'express';
import { UrlRepository } from '../repository/UrlRepository';
import { IRequest } from '../../models/Request';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export class UrlController {
    private urlRepository: UrlRepository;
    private baseUrl: string;

    constructor(urlRepository: UrlRepository) {
        this.urlRepository = urlRepository;
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3001/url';
    }

    public async createUrl(req: IRequest, res: Response): Promise<void> {
        try {
            const { original_url: originalUrl } = req.body;

            const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/;
            if (!originalUrl || !urlRegex.test(originalUrl)) {
                res.status(400).json({ error: 'Url inválida.' });
                return;
            }

            const shortCode = await this.generateShortUrl();

            let userId: number | null = null;

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
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ error: `Erro ao criar url encurtada, ${errorMessage}` });
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

            const clicks = (urlData.clicks ?? 0) + 1;
            await this.urlRepository.updateClicks(Number(urlData?.id), clicks);

            if (urlData.original_url) {
                res.redirect(urlData.original_url);
            } else {
                res.status(500).json({ error: 'URL original não encontrada.' });
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ error: `Erro ao redirecionar usuário, ${errorMessage}` });
        }
    }

    public async listAllUrlsByUser(req: IRequest, res: Response): Promise<void> {
        try {

            const userId = req.user?.payload?.id;

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
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ error: `Erro ao buscar Urls do usuário, ${errorMessage}` });
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
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ error: `Erro ao deletar Url, ${errorMessage}` });
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
            if (!isTheUser || isTheUser?.user_id != userId) {
                res.status(403).json({ error: 'Não é possível editar essa Url.' });
                return;
            }

            await this.urlRepository.updateUrl(urlId, originalUrl);

            res.status(200).json({ message: 'Url atualizado com sucesso!' });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ error: `Erro ao atualizar Url, ${errorMessage}` });
        }
    }

    private async generateShortUrl(): Promise<string> {
        while (true) {
            const shortCode = crypto.randomBytes(6).toString('base64').substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
            const exists = await this.urlRepository.findByShortCode(shortCode);
    
            if (!exists) {
                return shortCode;
            }
        }
    }

}
