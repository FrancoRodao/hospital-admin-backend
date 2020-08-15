const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const { check } = require('express-validator')
const  { getUsers, deleteUser, createUser, editAnyUser, selfEditUser } = require('../controllers/users.controller')
const { validateFields } = require('../middlewares/validateFields')
const {validateADMIN_ROLE} = require('../middlewares/validateADMIN_ROLE')

Router.post('/users', 
    [
        check(['name','email','password'], 'required field').not().isEmpty(), 
        validateFields
    ], 
    createUser)

//SELF EDIT USER
Router.put('/users', 
    [
        verifyToken,
        check(['_id','name','role'], 'required field').not().isEmpty(),
        validateFields, 
    ], 
    selfEditUser)

//EDIT ANY USER ONLY ADMIN ROLE
Router.put('/users/:id',[
    verifyToken,
    validateADMIN_ROLE,
    check(['_id','name','role'], 'required field').not().isEmpty(),
    validateFields,
    ], editAnyUser)


Router.get('/users', [verifyToken, validateADMIN_ROLE], getUsers)

Router.delete('/users/:id', [verifyToken, validateADMIN_ROLE] ,deleteUser)



module.exports = Router