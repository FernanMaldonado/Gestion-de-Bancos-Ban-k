import { Router } from 'express';
import { getTransacciones, transaction } from './transacciones.controller.js';

const router = Router();

// Ruta para realizar una transacción entre dos cuentas
router.post('/', transaction)

// Ruta para obtener todas las transacciones
router.get('/', getTransacciones)

export default router;