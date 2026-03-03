import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validaciones para crear cuentas
export const validateCreateCuenta = [
  body('nombreCompleto')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre completo debe tener entre 2 y 150 caracteres'),

  body('documentoIdentidad')
    .trim()
    .notEmpty()
    .withMessage('El documento de identidad es requerido')
    .isLength({ min: 5, max: 20 })
    .withMessage('El documento de identidad debe tener entre 5 y 20 caracteres'),

  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .isLength({ min: 8, max: 15 })
    .withMessage('El teléfono debe tener entre 8 y 15 caracteres'),

  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Correo inválido'),

  body('tipoCuenta')
    .trim()
    .notEmpty()
    .withMessage('El tipo de cuenta es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El tipo de cuenta debe tener entre 3 y 50 caracteres'),

  body('numeroCuenta')
    .trim()
    .notEmpty()
    .withMessage('El número de cuenta es requerido')
    .isLength({ min: 5, max: 30 })
    .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),

  body('saldo')
    .notEmpty()
    .withMessage('El saldo es requerido')
    .isNumeric()
    .withMessage('El saldo debe ser un número'),

  checkValidators,
];

// Validaciones para actualizar cuentas
export const validateUpdateCuentaRequest = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),

  body('nombreCompleto')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre completo debe tener entre 2 y 150 caracteres'),

  body('documentoIdentidad')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('El documento de identidad debe tener entre 5 y 20 caracteres'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage('El teléfono debe tener entre 8 y 15 caracteres'),

  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Correo inválido'),

  body('tipoCuenta')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El tipo de cuenta debe tener entre 3 y 50 caracteres'),

  body('numeroCuenta')
    .optional()
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage('El número de cuenta debe tener entre 5 y 30 caracteres'),

  body('saldo')
    .optional()
    .isNumeric()
    .withMessage('El saldo debe ser un número'),

  checkValidators,
];

// Validación para activar/desactivar cuentas
export const validateCuentaStatusChange = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

// Validación para obtener cuenta por ID
export const validateGetCuentaById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];
