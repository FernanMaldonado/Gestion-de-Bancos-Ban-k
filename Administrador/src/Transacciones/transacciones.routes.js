import { Router } from 'express';
import { getTransacciones, getTransaccionByYear, getTransaccionByMonth } from './transacciones.controller.js';
import { validateGetTransacciones } from '../../middlewares/transacciones-validation.js';

const router = Router();

// Ruta para obtener todas las transacciones
router.get('/', getTransacciones)

// Ruta para obtener transacciones por año: /2008
router.get('/:year', validateGetTransacciones, getTransaccionByYear)

// Ruta para obtener transacciones por mes: /2008/12
router.get('/:year/:month', validateGetTransacciones, getTransaccionByMonth)

export default router;