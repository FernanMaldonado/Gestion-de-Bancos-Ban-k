import { Router } from 'express';
import { createUsuario, getUsuarioLogueado, getUsuarioById, updateUsuario, deleteUsuario } from './usuarios.controller.js';
import { validateCreateUsuario, validateUpdateUsuario, validateUsuarioId } from '../../middlewares/usuario-validation.js';
import { validateJWT } from "../../middlewares/validate-jwt.js";

const router = Router();

router.get('/me', validateJWT, getUsuarioLogueado);

router.get('/:id', validateUsuarioId, getUsuarioById);

// Metodo para crear un nuevo campo
router.post('/', validateCreateUsuario, createUsuario);

router.put('/:id', validateUpdateUsuario, updateUsuario);

router.delete('/:id', validateUsuarioId, deleteUsuario);


export default router;