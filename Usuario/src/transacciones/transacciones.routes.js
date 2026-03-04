import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { crearTransaccion, obtenerMisTransacciones } from './transacciones.controller.js';

const router = Router();

router.post('/transferir', validateJWT, crearTransaccion);
router.get('/mis-transacciones', validateJWT, obtenerMisTransacciones);

export default router;