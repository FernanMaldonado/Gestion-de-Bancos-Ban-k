import { Router } from 'express';
import { createUsuario, getUsuarios } from './usuarios.controller.js';

const router = Router();

// Metodo para obtener los usuarios
router.get('/', getUsuarios);

// Metodo para crear un nuevo campo
router.post('/', createUsuario);

export default router;