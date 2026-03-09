import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';

import {
    crearCompra,
    obtenerMisCompras,
    obtenerComprasPorCuenta
} from './compra.controller.js';

import {
    validateCreateCompra,
} from '../../middlewares/compra-validation.js';

const router = Router();

/* =========================================
   CREAR COMPRA
========================================= */
router.post(
    '/',
    validateJWT,
    validateCreateCompra,
    crearCompra
);

/* =========================================
   OBTENER MIS COMPRAS
========================================= */
router.get(
    '/mis-compras',
    validateJWT,
    obtenerMisCompras
);

router.get(
    '/mis-compras/:numeroCuenta',
    validateJWT,
    obtenerComprasPorCuenta
);

export default router;