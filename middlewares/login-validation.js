import { body } from 'express-validator';
import { checkValidators } from '../middlewares/check-validators.js';

export const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    checkValidators,
];
