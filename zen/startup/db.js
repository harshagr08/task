const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = () => {
    mongoose.connect('mongodb+srv://test:doDSF39grqRulNb6@cluster0.6ci57.mongodb.net/zen?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => console.log(chalk.cyan('Connected to mongodb...')));
};
