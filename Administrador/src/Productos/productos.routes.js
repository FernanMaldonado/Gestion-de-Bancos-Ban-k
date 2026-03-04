'use strict';

import express from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  changeProductoStatus,
} from './productos.controller.js';
import {
  validateProductoId,
  validateCreateProducto,
  validateUpdateProducto
} from '../../middlewares/productos-validation.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getProductos);

// Obtener producto por ID
router.get('/:id', validateProductoId, getProductoById);

// Crear producto
router.post('/', validateCreateProducto, createProducto);

// Actualizar producto
router.put('/:id', validateUpdateProducto, updateProducto);

// Activar / desactivar producto
router.put('/activar/:id', validateProductoId, changeProductoStatus);
router.put('/desactivar/:id', validateProductoId, changeProductoStatus);

export default router;
