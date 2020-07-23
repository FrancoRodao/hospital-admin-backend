const fs = require('fs')
const util = require('util');
const deleteFile = util.promisify(fs.unlink);

const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user');
const { multerConfig, customMulterError }= require('../libs/multer')

const { request } = require('express');
const multer = require('multer')




const uploadImage = async (req = request, res) => {
    try {
        multerConfig(req, res, async (err) => {

            if (err instanceof customMulterError) {
                return res.status(500).json({
                    ok: "false",
                    message: err.message
                })
            }

            if (err instanceof multer.MulterError) {
                return res.status(500).json({
                    ok: "false",
                    message: "An unexpected error occurred while uploading image with the library"
                })

            } else if (err) {
                return res.status(500).json({
                    ok: "false",
                    message: "An unexpected error occurred while uploading image"
                })
            }

            if (!req.file) {
                return res.status(404).json({
                    ok: "false",
                    message: 'Image not found in your pc'
                })
            }


            const id = req.params.id
            const type = req.params.type
            const defaultImagePath = 'uploads/images/default.svg'

            switch (type) {
                case 'doctor':
                    //CHECK IF DOCTOR EXISTS
                    const doctor = await Doctor.findById(id)
                    if (doctor == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this doctor doesn't exists"
                        });
                    }

                    //DELETE OLD IMAGE
                    const deleteImageDoctor = await deleteFile(user.img).catch(err => {
                        console.log('error when deleting old image')
                    })
                    //SAVE NEW IMAGE PATH
                    doctor.img = "uploads/images/doctor/" + req.file.filename
                    doctor.save()
                    return res.status(200).json({
                        ok: "true",
                        message: doctor.img
                    });
                case 'user':
                    const user = await User.findById(id)
                    if (user == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this user doesn't exists"
                        });
                    }

                    if (user.img != defaultImagePath) {
                        if (!user.img.includes('https://lh3.googleusercontent.com/a-/')) {
                            const deleteImageUser = await deleteFile(user.img).catch(err => {
                                console.log('error when deleting old image')
                            })
                        }
                    }

                    user.img = "uploads/images/user/" + req.file.filename
                    user.save()
                    return res.status(200).json({
                        ok: "true",
                        message: user.img
                    });

                case 'hospital':
                    const hospital = await Hospital.findById(id)

                    if (hospital == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this hospital doesn't exists"
                        });
                    }

                    const deleteImageHospital = await deleteFile(user.img).catch(err => {
                        console.log('error when deleting old image')
                    })
                    
                    hospital.img = "uploads/images/hospital/" + req.file.filename
                    hospital.save()
                    return res.status(200).json({
                        ok: "true",
                        message: hospital.img
                    });
                default:
                    throw new Error('error in switch');
            }
        })
        
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({
                ok: "false",
                message: "An unexpected error occurred while uploading image with library"
            })

        } else if (err) {
            return res.status(500).json({
                ok: "false",
                message: "An unexpected error occurred while uploading image"
            })
        }

    }
}

const getImage = async (req, res) => {
    try {
        const { id, type } = req.params
        const validTypes = ['doctor', 'hospital', 'user']
        const defaultImagePath = 'uploads/images/default.svg'

        if (validTypes.indexOf(type) != -1) {
            switch (type) {
                case 'doctor':
                    const doctor = await Doctor.findById(id)
                    if (doctor == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this doctor doesn't exists"
                        });
                    }
                    const imagePathDoctor = doctor.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/doctor' + imagePathDoctor
                    });

                case 'user':
                    const user = await User.findById(id)
                    if (user == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this user doesn't exists"
                        });
                    }
                    const imagePathUser = user.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/user' + imagePathUser
                    });

                case 'hospital':
                    const hospital = await Hospital.findById(id)
                    if (hospital == null) {
                        return res.status(401).json({
                            ok: "false",
                            message: "this hospital doesn't exists"
                        });
                    }
                    const imagePathHospital = hospital.img
                    return res.status(200).json({
                        ok: "true",
                        message: 'uploads/images/hospital' + imagePathHospital
                    });

                default:
                    throw new Error('error in switch');
            }
        } else {
            return res.status(401).json({
                ok: "false",
                message: 'invalid type (valid types: ' + validTypes + ')'
            });
        }

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN UPLOADING IMAGE".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while uploading image"
        })
    }
}


const deleteImage = async (req, res) => {
    try {
        const { id, type } = req.params
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

    } catch (err) {
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