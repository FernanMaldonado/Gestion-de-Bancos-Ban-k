import { Router } from 'express';
import {
    getPrestamos,
    getPrestamosPendientes,
    getPrestamoById,
    getPrestamosByCuenta,
    changePrestamoStatus,
} from './prestamos.controller.js';

const router = Router();

// listar todos los préstamos
router.get('/', getPrestamos);

// listar pendientes
router.get('/pendientes', getPrestamosPendientes);

// obtener por id
router.get('/:id', getPrestamoById);

// obtener por id de cuenta
router.get('/cuenta/:cuentaId', getPrestamosByCuenta);

// aprobar o rechazar préstamo
router.put('/:id/aprobar', changePrestamoStatus);
router.put('/:id/denegar', changePrestamoStatus);

export default router;
