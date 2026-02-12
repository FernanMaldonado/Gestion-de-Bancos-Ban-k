import { Router } from 'express';
import {
    getCuentas,
    getCuentaById,
    createCuenta,
    updateCuenta,
    changeCuentaStatus,
} from './cuenta.controller.js';
import {
    validateCreateCuenta,
    validateUpdateCuentaRequest,
    validateCuentaStatusChange,
    validateGetCuentaById,
} from '../../middlewares/cuenta-validation.js';

const router = Router();

// Rutas GET
router.get('/', getCuentas);
router.get('/:id', validateGetCuentaById, getCuentaById);

// rutas POST
router.post(
    '/',
    validateCreateCuenta,
    createCuenta
);

// Rutas PUT - actualizar cuenta
router.put(
    '/:id',
    validateUpdateCuentaRequest,
    updateCuenta
);

router.put('/:id/activar', validateCuentaStatusChange, changeCuentaStatus);
router.put('/:id/desactivar', validateCuentaStatusChange, changeCuentaStatus);

export default router;
