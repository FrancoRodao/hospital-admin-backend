const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const { uploadImage, getImage, deleteImage } = require('../controllers/images.controller');

Router.post('/image/:id/:type', 
    [
    verifyToken
    ], 
    uploadImage)

Router.get('/image/:id/:type', [verifyToken], getImage)

Router.delete('/image/:id/:type', [verifyToken] ,deleteImage)


module.exports = Router
