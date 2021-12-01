const mongoose = require('mongoose');
const Joi = require('joi');
const chalk = require('chalk');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

// const { Counter, getSequenceNextValue, insertCounter } = require('./autoIncrement');
//

const autoIncrement = require('mongoose-sequence')(mongoose);

const invoiceDetailSchema = new Schema({
    invoiceNo: {
        type: Number,
    },
    productId: {
        type: Schema.Types.ObjectID,
        ref: 'Product'
    },
    rate: {
        type: Number,
        min: 0,
        max: 10000,
        required: true,
    },
    unit: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
    },
    qty: {
        type: Number,
        min: 1,
        max: 50,
        required: true,
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    netAmount: {
        type: Number,
        min: 0,
        max: 100000,
        required: true,
    },
    totalAmount: {
        type: Number,
        min: 0,
        max: 100000,
        required: true,
    },

}, {
    timestamps: true,
});


invoiceDetailSchema.plugin(autoIncrement,{inc_field: 'invoiceNo'});

validateInvoiceSchema = async (invoiceSchema) => {
    const schema = Joi.object({
        product_id: Joi.string().alphanum().min(24).max(24).required(),
        rate: Joi.number().min(0).max(10000).required(),
        unit: Joi.number().min(0).max(10).required(),
        qty: Joi.number().min(0).max(50).required(),
        discountPercentage: Joi.number().min(0).max(100).required(),
        netAmount: Joi.number().min(0).max(10000).required(),
        totalAmount: Joi.number().min(0).max(10000).required(),
        name: Joi.string().min(3).max(24).required(),
    });
    try {
        return await schema.validate(invoiceSchema);
    } catch (err) {
        //todo
    }
};



// invoiceDetailSchema.pre('save', function (next) {
//     let doc = this;
//     getSequenceNextValue("invoiceNo").then(counter => {
//         if (!counter) {
//             insertCounter("invoiceNo").then(counter => {
//                 doc._id = counter;
//                 next();
//             })
//         } else {
//             doc._id = counter;
//             next()
//         }
//     }).catch(err => next(err))
//
// });


const Invoice_detail = mongoose.model('Invoice_Details', invoiceDetailSchema, 'invoice_detail');

exports.Invoice_detail = Invoice_detail;
exports.validateInvoiceSchema = validateInvoiceSchema;
