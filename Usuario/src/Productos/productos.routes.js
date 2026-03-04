'use strict';

import express from 'express';
import {
    getProductos,
    getProductoById
} from './productos.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getProductos);

// Obtener producto por ID
router.get('/:id', getProductoById);

export default router;