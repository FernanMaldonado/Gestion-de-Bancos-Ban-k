'use strict';

// Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { cordOptions } from './cors-configuration.js';
import adminRoutes from '../src/admin/admin.routes.js';
import cuentaRoutes from '../src/cuenta/cuenta.routes.js';
import transaccionRoutes from '../src/transacciones/transacciones.routes.js';
import usuariosRoutes from '../src/usuarios/usuarios.routes.js'
import { dbConnection } from './db.js';
import loginRoutes from '../src/login/login.routes.js';
import { createDefaultAdmin } from '../src/admin/admin.controller.js';

const BASE_URL = '/Ban-k/v1';

// Configuración de middlewares
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(cordOptions));
    app.use(morgan('dev'));
}

// Integración de rutas
const routes = (app) => {

    app.use(`${BASE_URL}/loginAdmin`, loginRoutes);
    app.use(`${BASE_URL}/admins`, adminRoutes);
    app.use(`${BASE_URL}/cuentas`, cuentaRoutes);
    app.use(`${BASE_URL}/transacciones`, transaccionRoutes);
    app.use(`${BASE_URL}/login`, loginRoutes);
    app.use(`${BASE_URL}/usuarios`, usuariosRoutes);
};

// Iniciar servidor
const initServer = async (app) => {

    app = express();
    const PORT = process.env.PORT || 3001;

    try {
        dbConnection();
        await createDefaultAdmin();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`El servidor está en el puerto ${PORT}`);
            console.log(`Base URL : http://localhost:${PORT}${BASE_URL}`);
        });

        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({
                status: 'ok',
                service: 'Ban-k Admin',
                version: '1.0.0'
            });
        });

    } catch (error) {
        console.log(error);
    }
}

export { initServer };
