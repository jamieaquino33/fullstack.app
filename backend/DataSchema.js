/* Creating a Mongoose Schema that we will use to make sure that the data we send to out Mongo database is formatted correctly */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DataSchema = new Schema(
    {
        id: Number,
        message: String
    },
    { timestamps: true }
);
module.exports = mongoose.model('Data', DataSchema);




