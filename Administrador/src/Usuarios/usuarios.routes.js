import { Router } from 'express';
import { getUsuarios, getUsuarioById } from './usuarios.controller.js';
import { validateUsuarioId } from '../../middlewares/usuario-validation.js';

const router = Router();

// Metodo para obtener los usuarios
router.get('/', getUsuarios);

router.get('/:id', validateUsuarioId, getUsuarioById);

export default router;