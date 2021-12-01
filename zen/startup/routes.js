const invoiceController = require('../controllers/invoice');
const productController = require('../controllers/product');
const error = require('../middleware/error');

module.exports = (app) => {
    app.use('/api/invoice', invoiceController);
    app.use('/api/product', productController);
    app.use(error);
}
