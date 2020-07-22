const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const  { createDoctor, editDoctor, deleteDoctor, getDoctors } = require('../controllers/doctor.controller');
const { validateFields } = require("../middlewares/validateFields");
const { check } = require('express-validator')

Router.post('/doctors', 
    [
    check(['name','email','role'], 'required field').not().isEmpty(),
    validateFields,
    verifyToken
    ], 
    createDoctor)

Router.put('/doctors', 
    [
        check(['name','email','role'], 'required field').not().isEmpty(),
        validateFields,
        verifyToken
    ], 
    editDoctor)

Router.get('/doctors', [verifyToken], getDoctors)

Router.delete('/doctors', [verifyToken] ,deleteDoctor)


module.exports = Router