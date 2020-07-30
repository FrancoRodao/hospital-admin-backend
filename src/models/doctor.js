const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')
const paginate = require('mongoose-paginate-v2')

const doctorSchema = new Schema({
    name: { type: String, required: [true, 'name is required'] },
    img: { type: String, required: false, default: 'uploads/images/default.svg' },
    hospital: { type: String, ref: 'Hospital', required: [true, 'hospital is required']},
    lastUserModifedIt: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},{
    timestamps: true
});

doctorSchema.plugin(uniqueValidator, {message: 'This {PATH} is required'})
doctorSchema.plugin(paginate)
module.exports = mongoose.model('Doctor', doctorSchema);