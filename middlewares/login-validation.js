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
export const validateLoginAdmin = (req, res, next) => {
    const { name, password } = req.body;

    const errors = [];

    if (!name) {
        errors.push({
            field: 'name',
            message: 'El nombre es obligatorio'
        });
    }

    if (!password) {
        errors.push({
            field: 'password',
            message: 'La contraseña es obligatoria'
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'error validation',
            error: errors
        });
    }

    next();
};
