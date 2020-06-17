const moongose = require('mongoose')
const Schema = moongose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const validRoles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    img: {
        type: String    
    },
    role: {
        type: String,
        required: [true, "role is required"],
        default: 'USER_ROLE',
        enum: validRoles
    }
},{
    timestamps: true
})

userSchema.plugin(uniqueValidator,{message: 'This {PATH} is already registered, please use another'})

module.exports = moongose.model('User', userSchema)

