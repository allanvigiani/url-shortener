import { Request, Response } from 'express';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import UserRepository from '../repository/UserRepository';
import jwt from 'jsonwebtoken';

export class UserController {
	private userRepository: UserRepository;
	saltRandsPassword: number;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
		this.saltRandsPassword = 10;
	}

	public async getUser(req: Request, res: Response): Promise<void> {
		// try {
		//   const userId = req.params.id; // Supõe-se que o ID do usuário venha na URL
		//   const user = await this.userRepository.findUserById(userId);
		//   res.json(user);
		// } catch (error) {
		//   res.status(500).json({ error: 'Erro ao buscar usuário' });
		// }
	}

	public async createUser(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if (!regexEmail.test(email)) {
				res.status(400).json({ error: 'Email não é válido.' });
				return;
			}

			const userExists = await this.userRepository.findUserByEmail(email);
			if (userExists) {
				res.status(400).json({ error: 'Usuário já cadastrado com esse email.' });
				return;
			}

			if (!password || typeof password !== 'string') {
				res.status(400).json({ error: 'Senha inválida ou não fornecida.' });
				return;
			}

			const hashedPassword: string = await bcryptHash(password, this.saltRandsPassword);

			await this.userRepository.createUser(email, hashedPassword);

			res.status(201).json({
				message: 'Usuário criado com sucesso!'
			});
		} catch (error: any) {
			res.status(500).json({ error: `Erro ao criar usuário, ${error.message}` });
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		// try {
		//   const userId = req.params.id;
		//   const updatedUser = await this.userRepository.updateUser(userId, req.body);
		//   res.json(updatedUser);
		// } catch (error) {
		//   res.status(500).json({ error: 'Erro ao atualizar usuário' });
		// }
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		// try {
		//   const userId = req.params.id;
		//   await this.userRepository.deleteUser(userId);
		//   res.status(204).send();
		// } catch (error) {
		//   res.status(500).json({ error: 'Erro ao deletar usuário' });
		// }
	}

	async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
				res.status(400).json({ error: 'Preencha o email e a senha para realizar o login.' });
				return;
            }

            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
				res.status(400).json({ error: 'Usuário não encontrado.' });
				return;
            }

			const passwordIsValid: boolean = await bcryptCompare(password, user.password || '');
			if (!passwordIsValid) {
				res.status(400).json({ error: 'Email ou senha incorretos.' });
				return;
			}

            const id = user.id;
            const payload = { id, email };

            const token = jwt.sign({ payload }, process.env.AUTH_SECRET || '', {
                expiresIn: process.env.AUTH_EXPIRES_IN || '7d',
            });

			res.status(200).json({
				message: 'Login realizado com sucesso!',
				email: user.email,
                token: token
			});
        } catch (error: any) {
			res.status(500).json({ error: `Erro ao realizar login, ${error.message}` });
        }
    }

}
