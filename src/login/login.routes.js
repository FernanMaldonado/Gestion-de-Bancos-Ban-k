import { Router } from 'express';
import { login } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';
import { loginUsuario } from './login.controller.js';

const router = Router();

router.post('/', validateLogin, login);
router.post('/usuario', validateLogin, loginUsuario);

export default router;