import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import {
    getMisDepositos,
    getMisDepositosPorCuenta,
    crearDeposito
} from './depositos.controller.js';

const router = Router();

// Rutas de depósitos
router.get('/mis-depositos', validateJWT, getMisDepositos); // Depósitos de todas las cuentas del usuario
router.get('/mis-depositos/:numeroCuenta', validateJWT, getMisDepositosPorCuenta); // Mis depósitos por número de cuenta
router.post('/', validateJWT, crearDeposito);

export default router;