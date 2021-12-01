const mongoose = require('mongoose');
const Joi = require('joi');
const chalk = require('chalk');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
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

}, {
    timestamps: true,
});


const Product = mongoose.model('Product', productSchema, 'product_master');

validateProductAddition = async (productData) => {
    const schema = Joi.object({
        product_name: Joi.string().alphanum().min(3).max(30).required(),
        rate: Joi.number().min(0).max(10000).required(),
        unit: Joi.number().min(0).max(10).required()
    });
    try {
        return await schema.validate(productData);
    } catch (err) {
        //todo
    }
};

exports.Product = Product;
exports.validateProductAddition = validateProductAddition;
