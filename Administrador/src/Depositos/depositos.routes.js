'use strict';

import express from 'express';
import { getDepositos, getDepositosByCuenta } from './depositos.controller.js';
import {
    validateGetDepositosByCuenta
} from '../../middlewares/depositos-validation.js';

const router = express.Router();

// Ruta para listar todos los depósitos
router.get('/', getDepositos);

// Ruta para listar depósitos por numeroCuenta
router.get('/cuenta/:numeroCuenta', validateGetDepositosByCuenta, getDepositosByCuenta);

export default router;
