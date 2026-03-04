import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validar ID de producto
export const validateProductoId = [
    param('id')
        .isMongoId()
        .withMessage('El ID del producto proporcionado no es un ObjectId válido'),
    checkValidators
];

// Validar creación de producto
export const validateCreateProducto = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isString()
        .withMessage('El nombre debe ser un texto'),
    body('descripcion')
        .optional()
        .isString()
        .withMessage('La descripción debe ser un texto'),
    body('precio')
        .notEmpty()
        .withMessage('El precio es obligatorio')
        .isNumeric()
        .withMessage('El precio debe ser un número')
        .custom(value => value >= 0).withMessage('El precio no puede ser negativo'),
    body('stock')
        .notEmpty()
        .withMessage('El stock es obligatorio')
        .isNumeric()
        .withMessage('El stock debe ser un número')
        .custom(value => value >= 0).withMessage('El stock no puede ser negativo'),
    checkValidators
];

// Validar actualización de producto
export const validateUpdateProducto = [
    param('id')
        .isMongoId()
        .withMessage('El ID del producto proporcionado no es un ObjectId válido'),
    body('nombre')
        .optional()
        .isString()
        .withMessage('El nombre debe ser un texto'),
    body('descripcion')
        .optional()
        .isString()
        .withMessage('La descripción debe ser un texto'),
    body('precio')
        .optional()
        .isNumeric()
        .withMessage('El precio debe ser un número')
        .custom(value => value >= 0).withMessage('El precio no puede ser negativo'),
    body('stock')
        .optional()
        .isNumeric()
        .withMessage('El stock debe ser un número')
        .custom(value => value >= 0).withMessage('El stock no puede ser negativo'),
    checkValidators
];
