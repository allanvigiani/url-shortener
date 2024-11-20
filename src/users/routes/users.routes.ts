import { Router } from 'express';
import { UserController } from '../controller/user-controller';
import  UserRepository  from '../repository/user-repository';
import validateToken from '../../middleware/auth';

const router = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.get('/:id', validateToken, userController.getUser.bind(userController));
router.post('/', validateToken, userController.createUser.bind(userController));
router.put('/:id', validateToken, userController.updateUser.bind(userController));
router.delete('/:id', validateToken, userController.deleteUser.bind(userController));

export default router;
