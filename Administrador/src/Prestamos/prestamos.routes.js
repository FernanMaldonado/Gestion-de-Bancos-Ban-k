import { Router } from 'express';
import {
    getPrestamos,
    getPrestamosPendientes,
    getPrestamoById,
    getPrestamosByCuenta,
    changePrestamoStatus,
} from './prestamos.controller.js';
import {
    validatePrestamoId,
    validatePrestamosByCuenta
} from '../../middlewares/prestamos-validation.js';

const router = Router();

// listar todos los préstamos
router.get('/', getPrestamos);

// listar pendientes
router.get('/pendientes', getPrestamosPendientes);

// obtener por id
router.get('/:id', validatePrestamoId, getPrestamoById);

// obtener por numero de cuenta
router.get('/cuenta/:numeroCuenta', validatePrestamosByCuenta, getPrestamosByCuenta);

// aprobar o rechazar préstamo
router.put('/:id/aprobar', validatePrestamoId, changePrestamoStatus);
router.put('/:id/denegar', validatePrestamoId, changePrestamoStatus);

export default router;
