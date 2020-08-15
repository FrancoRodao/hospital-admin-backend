const moongose = require('mongoose')
const Schema = moongose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const paginate = require('mongoose-paginate-v2')


const hospitalSchema = new Schema({
    name: {type: String, unique: true, required: [true, 'name is required']},
    img: {type: String, default: 'uploads/images/default.svg'},
    lastUserModifedIt: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    doctors: [
        {type: Schema.Types.ObjectId, ref: 'Doctor'}
    ]
},{
    timestamps: true
})

hospitalSchema.plugin(uniqueValidator, {message: 'This {PATH} is required'})
hospitalSchema.plugin(paginate)
module.exports = moongose.model('Hospital', hospitalSchema)
