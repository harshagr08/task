const express = require('express');
const router = express.Router();
const chalk = require('chalk');


const {
    Invoice_detail,
    validateInvoiceSchema
} = require('../models/invoice_detail');
const {
    Invoice_master,
} = require('../models/invoice_master');


const { Product } = require("../models/product");


router.get('/', (req, res, next) => {
    res.status(200).send('Hi, From Invoice Module');
});

router.post('/generate', async (req, res, next) => {

    //todo
    console.log(req.body);
    const joiValidate = await validateInvoiceSchema(req.body);
    if (joiValidate.error) return sendErrorResponse(res, {
        type: 'validation',
        message: joiValidate.error.details[0].message
    });

    const product = await Product.findById(req.body.product_id);
    if (!product) return sendErrorResponse(res, {
        type: '404',
        message: 'Product not found'
    });

    console.log(product);
    const invoice = new Invoice_detail({
        productId: product._id,
        unit: req.body.unit,
        qty: req.body.qty,
        rate: product.rate,
        totalAmount: product.rate * req.body.qty,
        netAmount: product.rate * req.body.qty,
        discountPercentage: req.body.discountPercentage,
    })


    const savedInvoice = await invoice.save()
        .then(async result => {
            console.log(chalk.green(`Invoice details  ${ JSON.stringify(result) }`));
            const masterInvoice = new Invoice_master({
                invoiceId: result._id,
                invoiceNo: result.invoiceNo,
                customerName: req.body.name,
                totalAmount: product.rate * req.body.qty,
            })

            await masterInvoice.save()

                .then(async result => {
                    console.log(chalk.green(`Invoice Created  ${ JSON.stringify(result) }`));

                    return sendSuccessResponse(res, 'Invoice Generate ');
                })
                .catch(err => {
                    next(err);
                });
        })
        .catch(err => {
            next(err);
        });


});


router.get('/all', async (req, res, next) => {
    console.log('called');
    const products = await Product.find({});
    if (!products) return sendErrorResponse(res, "No Products");
    return sendSuccessResponse(res, products);
});

const sendSuccessResponse = (res, responseMessage) => {
    res.json({ status: 200, data: responseMessage });
};


const sendErrorResponse = (res, error) => {
    res.status(400).json({ status: 400, data: error });
};

module.exports = router;
