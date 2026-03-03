'use strict';

import mongoose, {mongo} from "mongoose";

const PrestamosSchema = new mongoose.Schema({
    cantidad_prestada: {
        type: Number,
        required: true
    },
    cantidad_pendiente: {
        type: Number,
        default: 0
    },
    numero_cuenta: {
        type: String,
        required: true
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