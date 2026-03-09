'use strict';

import express from 'express';
import {
    getProductos,
    getProductoById,
    createProducto
} from './productos.controller.js';
import { validateCreateProducto } from '../../middlewares/productos-validation.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getProductos);
// Crear producto
router.post('/', validateCreateProducto, createProducto);

// Obtener producto por ID
router.get('/:id', getProductoById);

export default router;