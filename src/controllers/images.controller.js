const fs = require('fs')
const util = require('util');
const deleteFile = util.promisify(fs.unlink);

const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user');

const { request } = require('express');


const uploadImage = async (req = request,res)=>{
    try{
        if(req.fileValidationErrorType){
            return res.status(401).json({
                ok: "false",
                message: req.fileValidationErrorType
            });
        }

        if(req.fileValidationErrorId){
            return res.status(401).json({
                ok: "false",
                message: req.fileValidationErrorId
            });
        }

        if(req.fileValidationErrorExtension) {
            return res.status(401).json({
                ok: "false",
                message: req.fileValidationErrorExtension
            });
        }

        console.log(req.files)

        if(!req.file){
            return res.status(401).json({
                ok: "false",
                message: 'Image not found'
            });
        }
        
        const id = req.body.id
        const type = req.body.type
        const defaultImagePath = 'uploads/images/default.svg'

        switch (type) {
            case 'doctor':
                const doctor = await Doctor.findById(id)
                if(doctor == null){
                    return res.status(401).json({
                        ok: "false",
                        message: "this doctor doesn't exists"
                    });
                }
                doctor.img = "uploads/images/doctor/"+req.file.filename
                doctor.save()
                return res.status(200).json({
                    ok: "true",
                    message: doctor.img
                });
            case 'user':
                const user = await User.findById(id)
                if(user == null){
                    return res.status(401).json({
                        ok: "false",
                        message: "this user doesn't exists"
                    });
                }

                if(user.img != defaultImagePath){
                    if(!user.img.includes('https://lh3.googleusercontent.com/a-/')){
                        const deleteImage = await deleteFile(user.img)
                    }
                }

                user.img = "uploads/images/user/"+req.file.filename
                user.save()
                return res.status(200).json({
                    ok: "true",
                    message: user.img
                });
                
                break;
            case 'hospital':
                const hospital = await Hospital.findById(id)
                if(hospital == null){
                    return res.status(401).json({
                        ok: "false",
                        message: "this hospital doesn't exists"
                    });
                }
                hospital.img = "uploads/images/hospital/"+req.file.filename
                hospital.save()
                return res.status(200).json({
                    ok: "true",
                    message: hospital.img
                });
            default:
                throw new Error('error in switch');
        }


    }catch(error){
        console.log("AN ERROR HAPPENED WHEN UPLOADING IMAGE".red, error)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while uploading image"
        })
    }
}

const getImage = async (req,res)=>{
    try{
        const {type,id} = req.params
        const validTypes = ['doctor','hospital','user']
        const defaultImagePath = 'uploads/images/default.svg'

        if(validTypes.indexOf(type) != -1){
            switch (type) {
                case 'doctor':
                    const doctor = await Doctor.findById(id)
                    if(doctor == null){
                        return res.status(401).json({
                            ok: "false",
                            message: "this doctor doesn't exists"
                        });
                    }
                    const imagePathDoctor = doctor.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/doctor'+imagePathDoctor
                    });

                case 'user':
                    const user = await User.findById(id)
                    if(user == null){
                        return res.status(401).json({
                            ok: "false",
                            message: "this user doesn't exists"
                        });
                    }
                    const imagePathUser = user.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/user'+imagePathUser
                    });

                case 'hospital':
                    const hospital = await Hospital.findById(id)
                    if(hospital == null){
                        return res.status(401).json({
                            ok: "false",
                            message: "this hospital doesn't exists"
                        });
                    }
                    const imagePathHospital = hospital.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/hospital'+imagePathHospital
                    });

                default:
                    throw new Error('error in switch');
            }
        }else{
            return res.status(401).json({
                ok: "false",
                message: 'invalid type (valid types: '+validTypes+')'
            });
        }

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN UPLOADING IMAGE".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while uploading image"
        })
    }
}


const deleteImage = async (req,res)=>{
    try{
        const { type, id } = req.params
        const validTypes = ['doctor', 'hospital', 'user']
        const defaultImagePath = 'uploads/images/default.svg'

        switch (type) {
            case 'doctor':
                const doctor = await Doctor.findById(id)
                if (doctor == null) {
                    return res.status(401).json({
                        ok: "false",
                        message: "this doctor doesn't exists"
                    });
                }
                doctor.img = defaultImagePath
                doctor.save()
                return res.status(200).json({
                    ok: "true",
                    message: defaultImagePath
                });

            case 'user':
                const user = await User.findById(id)
                if (user == null) {
                    return res.status(401).json({
                        ok: "false",
                        message: "this user doesn't exists"
                    });
                }
                user.img = defaultImagePath
                user.save()
                return res.status(200).json({
                    ok: "true",
                    message: defaultImagePath
                });

            case 'hospital':
                const hospital = await Hospital.findById(id)
                if (hospital == null) {
                    return res.status(401).json({
                        ok: "false",
                        message: "this hospital doesn't exists"
                    });
                }
                hospital.img = defaultImagePath
                hospital.save()
                return res.status(200).json({
                    ok: "true",
                    message: defaultImagePath
                });

            default:
                throw new Error('error in switch');
        }

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN UPLOADING IMAGE".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while uploading image"
        })
    }
}


module.exports = {
    uploadImage,
    getImage,
    deleteImage
}