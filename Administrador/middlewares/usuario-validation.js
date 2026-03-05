import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validación para buscar por ID o Desactivar (GET / DELETE)
export const validateUsuarioId = [
    param('id').isMongoId().withMessage('ID de MongoDB no válido'),
    checkValidators
];