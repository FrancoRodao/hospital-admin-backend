const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const  { signin, signinGoogle, renewToken } = require('../controllers/login.controller');
const { validateFields } = require("../middlewares/validateFields");
const { check } = require("express-validator");


Router.post('/signin', 
    [
    check(['email', 'password'], 'required field').not().isEmpty(),
    validateFields
    ]
    ,signin)

Router.post('/signin/google', signinGoogle)

Router.get('/login/renew', [verifyToken] ,renewToken)



module.exports = Router