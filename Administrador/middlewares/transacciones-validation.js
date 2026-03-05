import {param} from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateGetTransacciones = [
    param('year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Numero de año invalido.'),
    param('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('El mes debe ser un número entero entre 1 y 12.'),
    checkValidators
];