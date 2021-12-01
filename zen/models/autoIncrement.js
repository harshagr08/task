const mongoose = require('mongoose');
const Joi = require('joi');
const chalk = require('chalk');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

// const getSequenceNextValue = (seqName) => {
//     return new Promise(((resolve, reject) => {
//         Counter.findByIdAndUpdate({
//                 "_id": seqName
//             },
//             { "$inc": { "$seq": 1 } }, ((err, counter) => {
//                 if (err) reject(err);
//                 if (counter) {
//                     resolve(counter.seq + 1)
//                 } else {
//                     resolve(null)
//                 }
//             }))
//     }))
// }
//
// const insertCounter = async (seqName) => {
//     const newCouter = Counter({
//         _id: seqName,
//         seq: 1
//
//     });
//     await newCouter.save();
// }

exports.Counter = Counter;
exports.getSequenceNextValue = getSequenceNextValue;
exports.insertCounter = insertCounter;
