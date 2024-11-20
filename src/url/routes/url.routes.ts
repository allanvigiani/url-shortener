import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('GET URL');
});

router.post('/', (req, res) => {
  res.send('POST URL');
});

export default router;
