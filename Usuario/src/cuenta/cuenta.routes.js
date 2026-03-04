import { Router } from 'express';
import {
    getMisCuentas,
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
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

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
router.get('/mis-cuentas', validateJWT, getMisCuentas);
router.get('/:id', validateGetCuentaById, getCuentaById);

export default router;
