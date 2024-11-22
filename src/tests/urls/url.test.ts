import { UrlController } from '../../url/controller/UrlController';
import { UrlRepository } from '../../url/repository/UrlRepository';

import { IRequest } from '../../models/Request';

import { Request, Response } from 'express';
import { IUrl } from '../../models/Url';

jest.mock('../../url/repository/UrlRepository', () => {
    return {
        UrlRepository: jest.fn().mockImplementation(() => ({
            createUrl: jest.fn(),
            findByShortCode: jest.fn(),
            updateClicks: jest.fn(),
            findAllUrlsByUserId: jest.fn(),
            findByUrlById: jest.fn(),
            deleteUrlById: jest.fn(),
            updateUrl: jest.fn(),
        })),
    };
});

describe('UrlController', () => {
    let urlController: UrlController;
    let mockUrlRepository: jest.Mocked<UrlRepository>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        mockUrlRepository = new UrlRepository() as jest.Mocked<UrlRepository>;
        urlController = new UrlController(mockUrlRepository);

        req = {
            body: {},
            params: {},
            user: { payload: { id: 'user123' } } as object as IRequest['user'],
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn(),
        };
    });

    describe('createUrl', () => {
        it('deve retornar erro 400 se a URL for inválida', async () => {
            req.body = { original_url: 'invalid-url' };

            await urlController.createUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Url inválida.' });
        });

        it('deve retornar erro 400 se o usuário for inválido', async () => {
            req.body = { original_url: 'http://valid-url.com' };
            req.user = { payload: {} } as object as IRequest['user'];

            await urlController.createUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuário inválido.' });
        });

        it('deve criar uma URL com sucesso', async () => {
            req.body = { original_url: 'http://valid-url.com' };
            req.user = { payload: { id: 1 } } as object as IRequest['user'];

            await urlController.createUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Url encurtada com sucesso!',
                original_url: 'http://valid-url.com',
                short_url: expect.stringContaining('http://localhost:3001/url/'),
            });
        });
    });

    describe('redirectUrl', () => {
        it('deve retornar erro 400 se o código não for fornecido', async () => {
            req.params = {};

            await urlController.redirectUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Código não fornecido.' });
        });

        it('deve retornar erro 404 se a URL não for encontrada', async () => {
            req.params = { shortened_code: '123abc' };

            mockUrlRepository.findByShortCode.mockResolvedValueOnce(null);

            await urlController.redirectUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'URL não encontrada ou deletada.' });
        });

        it('deve redirecionar com sucesso', async () => {
            req.params = { shortened_code: '123abc' };
        
            const mockUrlData: IUrl = {
                id: '1',
                user_id: 'user123',
                original_url: 'https://www.google.com',
                shortened_code: '123abc',
                shortened_url: '',
                clicks: 0
            };
        
            mockUrlRepository.findByShortCode.mockResolvedValueOnce(mockUrlData);
        
            await urlController.redirectUrl(req as IRequest, res as Response);
        
            expect(mockUrlRepository.updateClicks).toHaveBeenCalledWith(1, 1);
            expect(res.redirect).toHaveBeenCalledWith('https://www.google.com');
        });
        
    });

    describe('listAllUrlsByUser', () => {
        it('deve retornar erro 400 se o usuário não for fornecido', async () => {
            req.user = undefined;

            await urlController.listAllUrlsByUser(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuário indisponível.' });
        });

        it('deve retornar erro 404 se nenhuma URL for encontrada', async () => {
            mockUrlRepository.findAllUrlsByUserId.mockResolvedValueOnce(null);

            await urlController.listAllUrlsByUser(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Nenhuma URL encontrada.' });
        });

        it('deve listar URLs com sucesso', async () => {
            const mockUrlList: IUrl[] = [
                {
                    original_url: 'http://example.com',
                    shortened_url: '123abc',
                },
            ];

            mockUrlRepository.findAllUrlsByUserId.mockResolvedValueOnce(mockUrlList);

            await urlController.listAllUrlsByUser(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                informations: [
                    { shortened_url: 'http://localhost:3001/url/123abc', original_url: 'http://example.com' },
                ],
            });
        });


    });

    describe('deleteUrl', () => {
        it('deve retornar erro 400 se o ID não for fornecido', async () => {
            req.params = {};

            await urlController.deleteUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Id da Url indisponível.' });
        });

        it('deve retornar erro 403 se o usuário não for autorizado', async () => {
            req.params = { url_id: '123' };

            const mockUrlData: IUrl = {
                id: '123',
                user_id: 'differentUser',
                original_url: 'http://example.com',
                shortened_url: 'shortened_url',
                shortened_code: 'shortened_code',
                clicks: 0,
            };

            mockUrlRepository.findByUrlById.mockResolvedValueOnce(mockUrlData);

            await urlController.deleteUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Não é possível apagar essa Url.' });
        });


        it('deve deletar a URL com sucesso', async () => {
            req.params = { url_id: '123' };

            const mockUrlData: IUrl = {
                id: '123',
                user_id: 'user123',
                original_url: 'http://example.com',
                shortened_url: 'shortened_url',
                shortened_code: 'shortened_code',
                clicks: 0,
            };

            mockUrlRepository.findByUrlById.mockResolvedValueOnce(mockUrlData);

            await urlController.deleteUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Url deletada com sucesso!' });
        });


    });

    describe('updateUrl', () => {
        it('deve retornar erro 400 se o ID não for fornecido', async () => {
            req.params = {};

            await urlController.updateUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Id da Url indisponível.' });
        });

        it('deve retornar erro 400 se a URL original não for fornecida', async () => {
            req.params = { url_id: '123' };
            req.body = {};

            await urlController.updateUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'URL original é obrigatória.' });
        });

        it('deve retornar erro 403 se o usuário não for autorizado', async () => {
            req.params = { url_id: '123' };
            req.body = { original_url: 'http://example.com' };

            const mockUrlData: IUrl = {
                id: '123',
                user_id: 'differentUser',
                original_url: 'http://example.com',
                shortened_url: 'shortened_url',
                shortened_code: 'shortened_code',
                clicks: 0,
            };

            mockUrlRepository.findByUrlById.mockResolvedValueOnce(mockUrlData);

            await urlController.updateUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Não é possível editar essa Url.' });
        });



        it('deve atualizar a URL com sucesso', async () => {
            req.params = { url_id: '123' };
            req.body = { original_url: 'http://example.com' };

            const mockUrlData: IUrl = {
                id: '123',
                user_id: 'user123',
                original_url: 'http://example.com',
                shortened_url: 'shortened_url',
                shortened_code: 'shortened_code',
                clicks: 0,
            };

            mockUrlRepository.findByUrlById.mockResolvedValueOnce(mockUrlData);

            await urlController.updateUrl(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Url atualizado com sucesso!' });
        });

    });
});
