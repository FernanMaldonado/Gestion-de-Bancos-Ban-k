'use strict';

import mongoose, {mongo} from 'mongoose';

const RetirosSchema = new mongoose.Schema({
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

export default mongoose.model('Retiros', RetirosSchema);