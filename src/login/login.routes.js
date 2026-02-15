import { Router } from 'express';
import { login } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';

const router = Router();

// POST login real
router.post('/login', validateLogin, login);

export default router;
