'use strict';

import mongoose from "mongoose";

const PrestamosSchema = new mongoose.Schema({
    cuentaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuenta',
        required: true
    },
    cantidad_prestada: {
        type: Number,
        required: true
    },
    cantidad_pendiente: {
        type: Number,
        default: 0
    },
    tasa_interes: {
        type: Number,
        required: true,
        default: 10
    },
    plazo_meses: {
        type: Number,
        required: true
    },
    monto_cuota: {
        type: Number,
        default: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobado', 'rechazado', 'pagado', 'mora'],
        default: 'pendiente',
        required: true
    }
});

export default mongoose.model('Prestamos', PrestamosSchema);