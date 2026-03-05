'use strict';

import mongoose from 'mongoose';

const DepositoSchema = new mongoose.Schema({
    cuentaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    account_number: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Depositos', DepositoSchema);