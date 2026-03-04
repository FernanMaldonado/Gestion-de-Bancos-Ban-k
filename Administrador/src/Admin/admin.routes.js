import { Router } from 'express';
import {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    changeAdminStatus
} from './admin.controller.js';

import {
    validateCreateAdmin,
    validateUpdateAdmin,
    validateAdminStatusChange,
    validateGetAdminById
} from '../../middlewares/admin-validation.js';

const router = Router();

// Rutas GET
router.get('/', getAdmins);
router.get('/:id', validateGetAdminById, getAdminById);

// Rutas POST
router.post('/', validateCreateAdmin, createAdmin);

// Rutas PUT
router.put('/:id', validateUpdateAdmin, updateAdmin);
router.put('/:id/activate', validateAdminStatusChange, changeAdminStatus);
router.put('/:id/desactivate', validateAdminStatusChange, changeAdminStatus);

export default router;
