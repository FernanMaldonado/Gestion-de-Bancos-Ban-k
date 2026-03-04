'use strict';

import express from 'express';
import { getDepositos, getDepositoByCuentaId } from './depositos.controller.js';

const router = express.Router();

// Ruta para listar todos los depósitos
router.get('/', getDepositos);

// Ruta para listar depósitos por idcuenta
router.get('/:cuentaId', getDepositoByCuentaId);

export default router;
