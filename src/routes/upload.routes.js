const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const util = require('util');

const verifyToken = require('../middlewares/verifyToken')
const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user');



router.put('/uploadImage/:type/:id', async (req,res)=>{
    try{
        if(!req.files){
            return res.status(400).json({
                ok: "false",
                message: 'no image selected'
            });
        }

        const file = await req.files.image
        
        const fileNames = file.name.split('.')
        const fileExtension = fileNames[fileNames.length-1]

        const validExtensions = ['jpg','png','svg','gif','jpeg']

        if(validExtensions.indexOf(fileExtension) < 0){
            return res.status(400).json({
                ok: "false",
                message: 'invalid extension (valid extensions: '+validExtensions+')'
            });
        }

        const type = await req.params.type
        const id = await req.params.id
        const validTypes = ['doctor','hospital','user']
        if(validTypes.indexOf(type) < 0){
            return res.status(400).json({
                ok: "false",
                message: 'invalid type (valid types: '+validTypes+')'
            });
        }

        const imageName = id+'-'+uuidv4()+'.'+fileExtension 
        const moveImagePath = `./src/uploads/${type}/${imageName}`
        await file.mv(`./src/uploads/user/`+imageName)
        
        const upload = await uploadPerType(type, id, imageName)
        
        return res.status(200).json({
            upload
        });

        //USAR MULTER COLTAA

    }catch(error){
        console.log("AN ERROR HAPPENED WHEN UPLOADING IMAGE".red, error)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while uploading"
        })
    }
})

const uploadPerType = async (type, id, imageName)=>{

    switch (type) {
        case 'user':
            try{
                const findUser = await User.findById(id)
                const oldPath = './src/uploads/user/'+imageName
                if(findUser){
                    const existsFile = util.promisify(fs.exists);
                    const imageExists = await existsFile(oldPath)

                    if(imageExists){
                        const deleteFile = util.promisify(fs.unlink);
                        await deleteFile(oldPath)                      
                    }

                    findUser.img = imageName
                    const saveImage = await findUser.save()  

                    return {
                        ok: "true",
                        message: 'uploaded image'
                    }
                }

                return {
                    ok: "false",
                    message: 'This user does not exist'
                }



            }catch(err){
                throw err
            }
            

        case 'hospital':
            
            break;

        case 'doctor':
            
            break;

        default:
            break;
    }

}

module.exports = router