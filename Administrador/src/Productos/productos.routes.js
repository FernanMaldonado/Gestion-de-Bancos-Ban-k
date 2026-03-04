'use strict';

import express from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  changeProductoStatus,
} from './productos.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getProductos);

// Obtener producto por ID
router.get('/:id', getProductoById);

// Crear producto
router.post('/', createProducto);

// Actualizar producto
router.put('/:id', updateProducto);

// Activar / desactivar producto
router.put('/activar/:id', changeProductoStatus);
router.put('/desactivar/:id', changeProductoStatus);

export default router;
