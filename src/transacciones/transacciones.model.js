'use strict';

import mongoose, { mongo } from 'mongoose';

const TransaccionesSchema = new mongoose.Schema({
    idFromUsuario: {
        type: String,
        required: true
    },
    idToUsuario: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['transferencia', 'pago', 'recarga'],
        default: 'transferencia',
        required: true
    },
    description: {
        type: String,
        required: false,
        default: 'sin descripción'
    }
});

export default mongoose.model('Transacciones', TransaccionesSchema);