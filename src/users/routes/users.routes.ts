import { Router } from 'express';
import { UserController } from '../controller/UserController';
import validateToken from '../../middleware/Auth';

import UserRepository from '../repository/UserRepository';
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const router = Router();

router.get('/:id', validateToken, (req, res, next) => {
    userController.getUser(req, res);
});

router.post('/', (req, res, next) => {
    userController.createUser(req, res);
});

router.put('/:user_id', validateToken, (req, res, next) => {
    userController.updatePassword(req, res);
});

router.delete('/:user_id', validateToken, (req, res, next) => {
    userController.deleteUser(req, res);
});

router.post('/login', (req, res, next) => {
    userController.login(req, res);
});

export default router;
