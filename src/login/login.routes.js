import { Router } from 'express';
import { loginAdmin } from './login.controller.js';
import { login } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';

const router = Router();

router.post('/loginAdmin', validateLogin, loginAdmin);

export default router;
// POST login real
router.post('/login', validateLogin, login);

export default router;
