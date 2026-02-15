import {body} from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateTransaccion = [
    body('idFromUsuario')
        .notEmpty()
        .withMessage('El id de la cuenta de origen es requerido')
        .isMongoId()
        .withMessage('El id de la cuenta de origen debe ser un id válido'),
    body('idToUsuario')
        .notEmpty()
        .withMessage('El id de la cuenta de destino es requerido')
        .isMongoId()
        .withMessage('El id de la cuenta de destino debe ser un id válido'),
    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isNumeric()
        .withMessage('El monto debe ser un número'),
    body('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede tener más de 255 caracteres'),
    checkValidators,
];