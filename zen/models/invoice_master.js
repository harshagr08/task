const mongoose = require('mongoose');
const Joi = require('joi');
const chalk = require('chalk');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const invoiceMasterSchema = new Schema({
    invoiceId: {
        type: Schema.Types.ObjectID,
        ref: 'Invoice_Details'
    },
    invoiceNo: {
        type: Number,
        min: 0,
        max: 100000,
        required: true,
    },
    invoiceDate: {
        type: Date, default: Date.now
    },
    customerName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    totalAmount: {
        type: Number,
        min: 0,
        max: 1000000,
        required: true,
    },

}, {
    timestamps: true,
});


const Invoice_master = mongoose.model('Invoice_master', invoiceMasterSchema, 'invoice_master');

exports.Invoice_master = Invoice_master;
