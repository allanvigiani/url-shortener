import { UserController } from '../../users/controller/UserController';
import { UserRepository } from '../../users/repository/UserRepository';

import { IRequest } from '../../models/Request';
import { IUser } from '../../models/User';

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

jest.mock('../../users/repository/UserRepository', () => {
    return {
        UserRepository: jest.fn().mockImplementation(() => ({
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            findUserById: jest.fn(),
            updateUserById: jest.fn(),
            deleteUserById: jest.fn(),
        })),
    };
});

describe('UserController', () => {
    let userController: UserController;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;

        userController = new UserController(mockUserRepository);

        // Mock do Request e Response
        req = {
            body: {},
            params: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('createUser', () => {
        it('deve retornar erro 400 se o email for inválido', async () => {
            req.body = { email: 'invalid-email', password: 'password123' };

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email fornecido não é válido.' });
        });

        it('deve retornar erro 400 se o usuário já existir', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
        
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
            };
        
            mockUserRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
        
            await userController.createUser(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuário já cadastrado com esse email.' });
        });
        

        it('deve criar um novo usuário com sucesso', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };

            mockUserRepository.findUserByEmail.mockResolvedValueOnce(null);
            mockUserRepository.createUser.mockResolvedValueOnce(true);

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário criado com sucesso!' });
        });

        it('deve retornar erro 500 se ocorrer um erro inesperado', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };

            mockUserRepository.findUserByEmail.mockRejectedValueOnce(new Error('Erro inesperado'));

            await userController.createUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar usuário, Erro inesperado' });
        });
    });
    describe('updatePassword', () => {
        it('deve retornar erro 400 se a nova senha não for fornecida', async () => {
            req.params = { user_id: '1' };
            req.body = {};

            await userController.updatePassword(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Nova senha não foi passada.' });
        });

        it('deve retornar erro 403 se o usuário não tiver autorização', async () => {
            req.params = { user_id: '2' };
            req.body = { password: 'newpassword123' };
            req.user = { payload: { id: '1' } };
        
            const mockUser = { id: '3', email: 'test@example.com', password: 'hashedpassword' };
        
            mockUserRepository.findUserById.mockResolvedValueOnce(mockUser);
        
            await userController.updatePassword(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Você não tem permissão para atualizar este usuário.' });
        });
        

        it('deve atualizar a senha com sucesso', async () => {
            req.params = { user_id: '1' };
            req.body = { password: 'newpassword123' };
            req.user = { payload: { id: '1' } };
        
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedpassword' };
        
            mockUserRepository.findUserById.mockResolvedValueOnce(mockUser);
            mockUserRepository.updateUserById.mockResolvedValueOnce(true);
        
            await userController.updatePassword(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso!' });
        });
        
    });

    describe('deleteUser', () => {
        it('deve retornar erro 400 se o ID do usuário não for fornecido', async () => {
            req.params = {};

            await userController.deleteUser(req as IRequest, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Não foi passado o ID do usuário.' });
        });

        it('deve retornar erro 403 se o usuário não tiver permissão para deletar', async () => {
            req.params = { user_id: '2' };
            req.user = { payload: { id: '1' } };
        
            const mockUser = { id: '3', email: 'test@example.com', password: 'hashedpassword' };
        
            mockUserRepository.findUserById.mockResolvedValueOnce(mockUser);
        
            await userController.deleteUser(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Você não tem permissão para atualizar este usuário.' });
        });
        

        it('deve deletar o usuário com sucesso', async () => {
            req.params = { user_id: '1' };
            req.user = { payload: { id: '1' } };
        
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedpassword' };
        
            mockUserRepository.findUserById.mockResolvedValueOnce(mockUser);
            mockUserRepository.deleteUserById.mockResolvedValueOnce(true);
        
            await userController.deleteUser(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletada com sucesso!' });
        });
        
    });

    describe('login', () => {
        it('deve retornar erro 400 se email ou senha não forem fornecidos', async () => {
            req.body = { email: '', password: '' };

            await userController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Preencha o email e a senha para realizar o login.' });
        });

        it('deve retornar erro 400 se o usuário não for encontrado', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };

            mockUserRepository.findUserByEmail.mockResolvedValueOnce(null);

            await userController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
        });

        it('deve retornar erro 400 se a senha for incorreta', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
        
            const mockUser: IUser = {
                email: 'test@example.com', password: 'hashedpassword',
                id: ''
            };
        
            mockUserRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
        
            await userController.login(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email ou senha incorretos.' });
        });

        it('deve realizar o login com sucesso', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
        
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
            };
        
            mockUserRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
            (jwt.sign as jest.Mock).mockReturnValueOnce('valid-token');
        
            await userController.login(req as IRequest, res as Response);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login realizado com sucesso!',
                email: 'test@example.com',
                token: 'valid-token',
            });
        });
        
    });

});
