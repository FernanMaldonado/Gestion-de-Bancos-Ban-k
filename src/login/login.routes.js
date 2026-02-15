import { Router } from 'express';
import { login, loginAdmin } from './login.controller.js';
import { validateLogin, validateLoginAdmin } from '../../middlewares/login-validation.js';

const router = Router();

router.post('/loginAdmin', validateLoginAdmin, loginAdmin);

// POST login real
router.post('/login', validateLogin, login);

export default router;