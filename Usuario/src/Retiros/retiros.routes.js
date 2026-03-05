'use strict';

import express from 'express';
import {
    getRetiros,
    getRetirosByYearAndMonth,
    getRetirosByCuenta,
    crearRetiro
} from './retiros.controller.js';
import {
    validateGetRetirosByDate,
    validateGetRetirosByCuenta
} from '../../middlewares/retiros-validation.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = express.Router();

// Obtener todos los retiros (con paginación)
router.get('/', getRetiros);

// Obtener retiros por año y mes
router.get('/fecha/:year/:month', validateGetRetirosByDate, getRetirosByYearAndMonth);

// Obtener retiros por numero de cuenta
router.get('/cuenta/:numeroCuenta', validateGetRetirosByCuenta, getRetirosByCuenta);
router.post('/', validateJWT, crearRetiro);

export default router;