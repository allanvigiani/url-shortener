import { Request, Response } from 'express';
import UserRepository from '../repository/user-repository';

export class UserController {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
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
        // try {
        //   const newUser = await this.userRepository.createUser(req.body);
        //   res.status(201).json(newUser);
        // } catch (error) {
        //   res.status(500).json({ error: 'Erro ao criar usuário' });
        // }
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

}
