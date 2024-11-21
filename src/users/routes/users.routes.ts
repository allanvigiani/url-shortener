import { Router } from 'express';
import { UserController } from '../controller/UserController';
import validateToken from '../../middleware/Auth';

import UserRepository from '../repository/UserRepository';
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const router = Router();

router.get('/:id', validateToken, userController.getUser.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:id', validateToken, userController.updateUser.bind(userController));
router.delete('/:id', validateToken, userController.deleteUser.bind(userController));

router.post('/login', userController.login.bind(userController));

export default router;
