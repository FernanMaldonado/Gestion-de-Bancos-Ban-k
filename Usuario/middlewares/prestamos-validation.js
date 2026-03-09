import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';


// Validar ID de préstamo
export const validatePrestamoId = [
    param('id')
        .isMongoId()
        .withMessage('El ID de préstamo proporcionado no es un ObjectId válido'),
    checkValidators
];

// Validar ID de cuenta para préstamos
export const validatePrestamosByCuenta = [
    param('numeroCuenta')
        .isString()
        .withMessage('El número de cuenta debe ser un texto')
        .isLength({ min: 5, max: 30 })
        .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),
    checkValidators
];