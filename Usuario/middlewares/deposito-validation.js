import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validar ID de cuenta para obtener depósitos
export const validateGetDepositosByCuenta = [
    param('numeroCuenta')
        .isString()
        .withMessage('El número de cuenta debe ser un texto')
        .isLength({ min: 5, max: 30 })
        .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),
    checkValidators
];