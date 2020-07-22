const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validateFields')
const  { createHospital, editHospital, deleteHospital, getHospitals } = require('../controllers/hospital.controller')

Router.post('/hospitals',
    [
        check(['name'], 'required field').not().isEmpty(),
        validateFields,
        verifyToken
    ], 
    createHospital)

Router.put('/hospitals', 
    [
        check(['name'], 'required field').not().isEmpty(),
        validateFields,
        verifyToken 
    ], 
    editHospital)

Router.get('/hospitals', [verifyToken], getHospitals)

Router.delete('/hospitals', [verifyToken] ,deleteHospital)


module.exports = Router