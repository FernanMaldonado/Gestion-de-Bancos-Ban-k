import { Router } from 'express';
import { getTransacciones, transaction } from './transacciones.controller.js';
import { validateTransaccion } from '../../middlewares/transacciones-validation.js';

const router = Router();

// Ruta para realizar una transacción entre dos cuentas
router.post('/', validateTransaccion, transaction)

// Ruta para obtener todas las transacciones
router.get('/', getTransacciones)

export default router;