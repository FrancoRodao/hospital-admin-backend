const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const { check } = require('express-validator')
const  { getUsers, deleteUser, createUser, editUser } = require('../controllers/users.controller')
const { validateFields } = require('../middlewares/validateFields')

Router.post('/users', 
    [
        check(['name','email','password'], 'required field').not().isEmpty(), 
        validateFields,
        verifyToken
    ], 
    createUser)

Router.put('/users', 
    [
        check(['id','name','role'], 'required field').not().isEmpty(),
        validateFields, 
        verifyToken
    ], 
    editUser)

Router.get('/users', [verifyToken], getUsers)

Router.delete('/users', [verifyToken] ,deleteUser)



module.exports = Router