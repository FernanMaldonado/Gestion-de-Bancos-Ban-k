import { Router } from 'express';
import { createUsuario, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from './usuarios.controller.js';
import { validateCreateUsuario, validateUpdateUsuario, validateUsuarioId } from '../../middlewares/usuario-validation.js';

const router = Router();

// Metodo para obtener los usuarios
router.get('/', getUsuarios);

router.get('/:id', validateUsuarioId, getUsuarioById);

// Metodo para crear un nuevo campo
router.post('/', validateCreateUsuario, createUsuario);

router.put('/:id', validateUpdateUsuario, updateUsuario);

router.delete('/:id', validateUsuarioId, deleteUsuario);


export default router;