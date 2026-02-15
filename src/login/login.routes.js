import { Router } from 'express';
import { loginAdmin } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';

const router = Router();

router.post('/loginAdmin', validateLogin, loginAdmin);

export default router;