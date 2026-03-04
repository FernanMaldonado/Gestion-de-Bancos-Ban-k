import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCompraId = [
    param('id')
        .isMongoId()
        .withMessage('El ID de la compra proporcionado no es un ObjectId válido'),
    checkValidators
];

export const validateGetComprasByNumeroCuenta = [
    param('numeroCuenta')
        .isString()
        .withMessage('El número de cuenta debe ser un texto')
        .isLength({ min: 5, max: 30 })
        .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),
    checkValidators
];
