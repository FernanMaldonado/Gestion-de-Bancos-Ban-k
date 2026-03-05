import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Debe ser un correo válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener mínimo 6 caracteres'),

    checkValidators
];
