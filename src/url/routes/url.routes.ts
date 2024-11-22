import { Router } from 'express';
import { UrlController } from '../controller/UrlController';
import validateToken from '../../middleware/Auth';
import optionalValidateToken from '../../middleware/OpitinalAuth';
import { IRequest } from '../../models/Request';

import { UrlRepository } from '../repository/UrlRepository';
const urlRepository = new UrlRepository();
const urlController = new UrlController(urlRepository);

const router = Router();

router.post('/shortener', optionalValidateToken, (req, res) => {
    urlController.createUrl(req as IRequest, res)
});

router.get('/:shortened_code', (req, res) => {
    urlController.redirectUrl(req as IRequest, res)
});

router.get('/list/urls', validateToken, (req, res) => {
    urlController.listAllUrlsByUser(req as IRequest, res)
});

router.delete('/:url_id', validateToken, (req, res) => {
    urlController.deleteUrl(req as IRequest, res)
});

router.put('/:url_id', validateToken, (req, res) => {
    urlController.updateUrl(req as IRequest, res)
});

export default router;
