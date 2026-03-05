import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { login, logout } from './login.controller.js';
import { validateLogin } from '../../middlewares/login-validation.js';

const router = Router();

// POST login real
router.post('/login', validateLogin, login);
router.post("/logout", validateJWT, logout);

export default router;