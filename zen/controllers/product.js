const express = require('express');
const router = express.Router();
const chalk = require('chalk');


const {
    Product,
    validateProductAddition
} = require('../models/product');


router.get('/', (req, res, next) => {
    res.status(200).send('Hi, From Product Module');
});

router.post('/add', async (req, res, next) => {

    //todo
    const joiValidate = await validateProductAddition(req.body);
    if (joiValidate.error) return sendErrorResponse(res, {
        type: 'validation',
        message: joiValidate.error.details[0].message
    });

    const product = new Product({
        product_name: req.body.product_name,
        unit: req.body.unit,
        rate: req.body.rate

    })


    await product.save()
        .then(async result => {
            console.log(chalk.green(`Product created with data ${ JSON.stringify(result) }`));
            return sendSuccessResponse(res, { type: 'SUCCESS', message: 'Product Added' });
        })
        .catch(err => {
            next(err);
        });
});


router.get('/all', async (req, res, next) => {
    console.log('called');
    const products = await Product.find({});
    if(!products) return sendErrorResponse(res, "No Products");
    return sendSuccessResponse(res, products);
});

const sendSuccessResponse = (res, responseMessage) => {
    res.json({ status: 200, data: responseMessage });
};


const sendErrorResponse = (res, error) => {
    res.status(400).json({ status: 400, data: error });
};

module.exports = router;
