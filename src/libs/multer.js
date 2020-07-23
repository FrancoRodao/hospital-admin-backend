const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const mongooseValidId = require('mongoose').isValidObjectId

class customMulterError extends Error {
    constructor(message) {
        super();
        this.name = 'Custom multer error'
        this.message = message
    }
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const validTypes = ['doctor','hospital','user']
        const type = req.params.type
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
        }else{
            return cb(new customMulterError('invalid type (valid types: '+validTypes+')'));
        }

    },
    filename: async (req,file,cb)=>{
        const fileName = uuidv4()+path.extname(file.originalname)
        cb(null, fileName)
    }
})

const filterImage = (req, file, cb) => {
    const id = req.params.id
    if(!id || (mongooseValidId(id) == false)){
        return cb(new customMulterError('Invalid id'));
    }
    
    if(!file){
        return cb(new customMulterError('Not found image in your pc, please try later'));
    }

    const validExtensions = ['image/jpg','image/png','image/svg','image/gif','image/jpeg']
    const fileExtension = file.mimetype
    if (validExtensions.indexOf(fileExtension) == -1) {
        return cb(new customMulterError('Invalid image extension (valid extensions: '+validExtensions+')'));
    }

    const validTypes = ['doctor','hospital','user']
    const type = req.params.type
    if (validTypes.indexOf(type) == -1) {
        return cb(new customMulterError('Invalid type (valid types: '+validTypes+')'));
    }

    cb(null,true)
}

const multerConfig = multer({
    storage: storage,
    limits: {
        fieldSize: 2000000
    },
    fileFilter: filterImage
}).single('image')

module.exports = {multerConfig,customMulterError}
