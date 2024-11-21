import { Router } from 'express';
import { UrlController } from '../controller/UrlController';
import validateToken from '../../middleware/Auth';
import optionalValidateToken from '../../middleware/OpitinalAuth';

import UrlRepository from '../repository/UrlRepository';
const urlRepository = new UrlRepository();
const urlController = new UrlController(urlRepository);

const router = Router();

router.post('/shortener', optionalValidateToken, (req, res, next) => {
    urlController.createUrl(req as any, res)
});

router.get('/:shortened_code', (req, res, next) => {
    urlController.redirectUrl(req as any, res)
});

router.get('/list/urls', validateToken, (req, res, next) => {
    urlController.listAllUrlsByUser(req as any, res)
});

router.delete('/:url_id', validateToken, (req, res, next) => {
    urlController.deleteUrl(req as any, res)
});

router.put('/:url_id', validateToken, (req, res, next) => {
    urlController.updateUrl(req as any, res)
});

export default router;
