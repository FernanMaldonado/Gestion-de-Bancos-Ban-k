import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';


// Validar creación de admin
export const validateCreateAdmin = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isString()
        .withMessage('El nombre debe ser texto'),

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

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Estado no válido'),

    checkValidators
];


// Validar actualización
export const validateUpdateAdmin = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    body('name')
        .optional()
        .isString()
        .withMessage('El nombre debe ser texto'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo válido'),

    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener mínimo 6 caracteres'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Estado no válido'),

    checkValidators
];


// Validar cambio de estado
export const validateAdminStatusChange = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    checkValidators
];


// Validar obtener por ID
export const validateGetAdminById = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    checkValidators
];
