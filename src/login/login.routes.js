import { Router } from 'express';
import { login } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';

const router = Router();

// GET para probar
router.get('/', (req, res) => {
    res.json({ message: 'Login endpoint funciona, pero usa POST con username y password' });
});

// POST login real
router.post('/login', validateLogin, login);

export default router;
