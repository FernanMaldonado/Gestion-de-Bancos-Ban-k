import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validaciones para Crear Usuario (POST)
export const validateCreateUsuario = [
    body('name')
        .trim().notEmpty().withMessage('El nombre es requerido'),

    body('address')
        .notEmpty()
        .withMessage('La dirección es requerida'),

    body('job_name')
        .notEmpty()
        .withMessage('El nombre del trabajo es requerido'),

    body('monthly_income')
        .isFloat({ min: 0 })
        .withMessage('El ingreso mensual debe ser un número positivo'),

    body('birthdate')
        .isISO8601()
        .withMessage('Fecha de nacimiento no válida (formato AAAA-MM-DD)'),

    checkValidators
];

// Validaciones para Actualizar Usuario (PUT)
export const validateUpdateUsuario = [
    param('id').isMongoId().withMessage('ID de MongoDB no válido'),
    body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('phone').optional().notEmpty().withMessage('El teléfono no puede estar vacío'),
    body('job_name').optional().notEmpty().withMessage('El trabajo no puede estar vacío'),
    body('monthly_income').optional().isFloat({ min: 0 }).withMessage('El ingreso debe ser un número positivo'),
    checkValidators
];

// Validación para buscar por ID o Desactivar (GET / DELETE)
export const validateUsuarioId = [
    param('id').isMongoId().withMessage('ID de MongoDB no válido'),
    checkValidators
];