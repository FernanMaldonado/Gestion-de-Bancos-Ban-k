import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';


// ✅ Crear compra
export const validateCreateCompra = [

    body('producto')
        .notEmpty()
        .withMessage('El producto es requerido')
        .isMongoId()
        .withMessage('Debe ser un ObjectId válido'),

    body('descripcion')
        .trim()
        .notEmpty()
        .withMessage('La descripción es requerida')
        .isLength({ min: 5, max: 300 })
        .withMessage('La descripción debe tener entre 5 y 300 caracteres'),

    body('cantidad')
        .notEmpty()
        .withMessage('La cantidad es requerida')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero mayor a 0'),

    body('precioNormal')
        .notEmpty()
        .withMessage('El precio normal es requerido')
        .isFloat({ min: 0 })
        .withMessage('El precio normal debe ser un número mayor o igual a 0'),

    body('precioMejor')
        .notEmpty()
        .withMessage('El precio mejorado es requerido')
        .isFloat({ min: 0 })
        .withMessage('El precio mejorado debe ser un número mayor o igual a 0'),

    body('fechaSolicitud')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

    checkValidators,
];


// ✅ Actualizar compra
export const validateUpdateCompraRequest = [

    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),

    body('producto')
        .optional()
        .isMongoId()
        .withMessage('Debe ser un ObjectId válido'),

    body('descripcion')
        .optional()
        .trim()
        .isLength({ min: 5, max: 300 })
        .withMessage('La descripción debe tener entre 5 y 300 caracteres'),

    body('cantidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero mayor a 0'),

    body('precioNormal')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio normal debe ser mayor o igual a 0'),

    body('precioMejor')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio mejorado debe ser mayor o igual a 0'),

    body('fechaSolicitud')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

    checkValidators,
];


// ✅ Activar / Desactivar compra
export const validateCompraStatusChange = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    checkValidators,
];


// ✅ Obtener compra por ID
export const validateGetCompraById = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido de MongoDB'),
    checkValidators,
];