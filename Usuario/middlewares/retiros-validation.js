import { query, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validar parámetros de paginación
export const validateGetRetiros = [
    query('limite')
        .optional()
        .isNumeric()
        .withMessage('El límite debe ser un número'),
    query('desde')
        .optional()
        .isNumeric()
        .withMessage('El inicio debe ser un número'),
    checkValidators
];

// Validar parámetros de fecha
export const validateGetRetirosByDate = [
    param('year')
        .isNumeric()
        .withMessage('El año debe ser un número')
        .isLength({ min: 4, max: 4 })
        .withMessage('El año debe tener 4 dígitos'),
    param('month')
        .isNumeric()
        .withMessage('El mes debe ser un número')
        .custom(value => {
            if (value < 1 || value > 12) {
                throw new Error('El mes debe estar entre 1 y 12');
            }
            return true;
        }),
    checkValidators
];

// Validar ID de cuenta para retiros
export const validateGetRetirosByCuenta = [
    param('numeroCuenta')
        .isString()
        .withMessage('El número de cuenta debe ser un texto')
        .isLength({ min: 5, max: 30 })
        .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),
    checkValidators
];