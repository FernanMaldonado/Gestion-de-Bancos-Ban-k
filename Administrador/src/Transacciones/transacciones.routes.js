import { Router } from 'express';
import { getTransacciones, getTransaccionByYear, getTransaccionByMonth, transaction } from './transacciones.controller.js';
import { validateTransaccion } from '../../middlewares/transacciones-validation.js';

const router = Router();

// Ruta para realizar una transacción entre dos cuentas
router.post('/', validateTransaccion, transaction)

// Ruta para obtener todas las transacciones
router.get('/', getTransacciones)

// Ruta para obtener transacciones por año: /2008
router.get('/:year', getTransaccionByYear)

// Ruta para obtener transacciones por mes: /2008/12
router.get('/:year/:month', getTransaccionByMonth)

export default router;