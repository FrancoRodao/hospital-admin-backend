const multer = require('../libs/multer');
const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const { uploadImage, getImage, deleteImage } = require('../controllers/images.controller');

Router.post('/image', 
    [
    multer.single('image'),
    verifyToken
    ], 
    uploadImage)

Router.get('/image/:type/:id', [verifyToken], getImage)

Router.delete('/image/:type/:id', [verifyToken] ,deleteImage)


module.exports = Router
