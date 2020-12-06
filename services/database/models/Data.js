const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id: { type: Number, unique: true, min: 1 },
    city: String,
    start_date: Date,
    end_date: Date,
    price: Number,
    status: String,
    color: String
  }, {timestamps: true});


const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
  