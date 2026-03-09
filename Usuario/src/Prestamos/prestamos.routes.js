import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import {
    crearPrestamo,
    obtenerPrestamosUsuario,
    obtenerPrestamosPorCuenta
} from './prestamos.controller.js';

const router = Router();

// Crear préstamo
router.post('/', validateJWT, crearPrestamo);

// Obtener préstamos del usuario logueado
router.get('/mis-prestamos', validateJWT, obtenerPrestamosUsuario);

// Obtener préstamos por número de cuenta
router.get('/mis-prestamos/:numeroCuenta', validateJWT, obtenerPrestamosPorCuenta);

export default router;