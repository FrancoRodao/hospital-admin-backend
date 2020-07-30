const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const  { createDoctor, editDoctor, deleteDoctor, getDoctors } = require('../controllers/doctor.controller');
const { validateFields } = require("../middlewares/validateFields");
const { check } = require('express-validator')

Router.post('/doctors', 
    [
    check(['name','hospital'], 'required field').not().isEmpty(),
    validateFields,
    verifyToken
    ], 
    createDoctor)

Router.put('/doctors/:id', 
    [
        check(['name','hospital'], 'required field').not().isEmpty(),
        validateFields,
        verifyToken
    ], 
    editDoctor)

Router.get('/doctors', [verifyToken], getDoctors)

Router.delete('/doctors/:id', [verifyToken] ,deleteDoctor)


module.exports = Router