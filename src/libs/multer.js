const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const user = require('../models/user')
const path = require('path')


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const validTypes = ['doctor','hospital','user']
        const type = req.body.type
        if(validTypes.indexOf(type) != -1){
            switch (type) {
                case 'doctor':
                    cb(null, "uploads/images/doctor");
                    break;
                case 'user':
                    cb(null, "uploads/images/user");
                    break;
                case 'hospital':
                    cb(null, "uploads/images/hospital");
                    break;
                default:
                    throw new Error('error in switch');
            }
        }

    },
    filename: async (req,file,cb)=>{
        const fileName = uuidv4()+path.extname(file.originalname)
        cb(null, fileName)
    }
})

const filterImage = (req, file, cb) => {
    console.log(req.body.type)
    console.log(req.body.id)
    if(req.body.type || file.mimetype || req.body.id == null || undefined){
        req.fileValidationError = 'invalid'
        return cb(null, false, new Error(req.fileValidationError));
    }

    const validExtensions = ['image/jpg','image/png','image/svg','image/gif','image/jpeg']
    const fileExtension = file.mimetype
    if (validExtensions.indexOf(fileExtension) == -1) {
        req.fileValidationErrorExtension = 'invalid extension (valid extensions: '+validExtensions+')'
        return cb(null, false, new Error(req.fileValidationErrorExtension));
    }

    const validTypes = ['doctor','hospital','user']
    const type = req.body.type

    if (validTypes.indexOf(type) == -1) {
        req.fileValidationErrorType = 'invalid type (valid types: '+validTypes+')'
        return cb(null, false, new Error(req.fileValidationErrorType));
    }

    const id = req.body.id
    if (!id) {
        req.fileValidationErrorType = "this "+type+" doesn't exists"
        return cb(null, false, new Error(req.fileValidationErrorType));
    }

    cb(null,true)
}

module.exports = multer({
    storage: storage,
    limits: {
        fieldSize: 2000000
    },
    fileFilter: filterImage
})
