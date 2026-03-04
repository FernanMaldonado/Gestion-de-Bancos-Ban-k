import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';

import {
    crearTransaccion,
    obtenerMisTransacciones,
    obtenerTransaccionesPorCuenta,
    obtenerTransaccionesRecibidas,
    obtenerTransaccionesEnviadas
} from './transacciones.controller.js';

const router = Router();

router.post(
    '/transferir/:numeroCuentaOrigen',
    validateJWT,
    crearTransaccion
);

router.get(
    '/mis-transacciones',
    validateJWT,
    obtenerMisTransacciones
);

router.get(
    '/mis-transacciones/:numeroCuenta',
    validateJWT,
    obtenerTransaccionesPorCuenta
);

router.get(
    '/mis-transacciones/:numeroCuenta/recibidas',
    validateJWT,
    obtenerTransaccionesRecibidas
);

router.get(
    '/mis-transacciones/:numeroCuenta/enviadas',
    validateJWT,
    obtenerTransaccionesEnviadas
);

export default router;