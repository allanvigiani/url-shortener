import { Router } from 'express';
import { UserController } from '../controller/UserController';
import UserRepository from '../repository/UserRepository';
import validateToken from '../../middleware/Auth';

const router = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.get('/:id', validateToken, userController.getUser.bind(userController));
router.post('/', validateToken, userController.createUser.bind(userController));
router.put('/:id', validateToken, userController.updateUser.bind(userController));
router.delete('/:id', validateToken, userController.deleteUser.bind(userController));

export default router;
