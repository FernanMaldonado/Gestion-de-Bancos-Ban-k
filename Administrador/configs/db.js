"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        // -------------------- MONITOREO --------------------

        mongoose.connection.on("error", () => {
            console.log("MongoDB | no se pudo conectar a mongoDB");
            mongoose.disconnect();
        });

        mongoose.connection.on("connecting", () => {
            console.log("MongoDB | intentando conectar a mongoDB");
        });

        mongoose.connection.on("connected", () => {
            console.log("MongoDB | conectado a mongoDB");
        });

        mongoose.connection.on("open", () => {
            console.log("MongoDB | conectado a la base de datos kinalSports");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB | reconectado a mongoDB");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | desconectado de mongoDB");
        });

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
    } catch (error) {
        console.log(`MongoDB | error de conexion: ${error}`);
        process.exit(1);
    }
};

const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | señal recibida: ${signal}. Cerrando conexión a MongoDB...`);
    try {
        await mongoose.connection.close();
        console.log("MongoDB | conexión cerrada. Saliendo del proceso...");
        process.exit(0);
    } catch (error) {
        console.log(`MongoDB | error al cerrar la conexión: ${error}`);
        process.exit(1);
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));