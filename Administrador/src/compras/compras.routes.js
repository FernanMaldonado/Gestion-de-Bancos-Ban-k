'use strict';

import express from 'express';
import {
    getCompras,
    getComprasByYearAndMonth,
    getComprasByCuenta
} from './compras.controller.js';

import { validateGetComprasByNumeroCuenta } from '../../middlewares/compras-validation.js';

const router = express.Router();

// Obtener todas las compras
router.get('/', getCompras);

// Obtener compras por año y mes
router.get('/fecha/:year/:month', getComprasByYearAndMonth);

// Obtener compras por numero de cuenta
router.get('/cuenta/:numeroCuenta', validateGetComprasByNumeroCuenta, getComprasByCuenta);

export default router;
