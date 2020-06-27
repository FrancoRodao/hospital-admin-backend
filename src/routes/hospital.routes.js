const express = require('express')
const router = express.Router()
const Hospital = require('../models/hospital')
const verifyToken = require('../middlewares/verifyToken')

router.get('/getHospitals', verifyToken, async (req, res) => {
    try {
        const limit = Number(await req.query.limit || 5)
        const page = Number(await req.query.page || 0)
        const totalHospitals = await Hospital.countDocuments()
        let totalPages = await Math.round(total/limit)-1
        if(totalPages <= 0){
            totalPages = 0
        }
        
        if(page < 0 || !Number.isInteger(page) || !Number.isInteger(limit) || limit < 0){
            return res.status(400).json({
                ok: "false",
                message: "page and limit must be an integer",
            });
        }
        if(page > totalPages){
            return res.status(400).json({
                ok: "false",
                message: `There are only ${totalPages} pages`,
            });
        }

        const getHospitals = await Hospital.find({}).limit(limit).skip(page*limit);

        res.status(200).json({
            ok: "true",
            hospitals: getHospitals,
            totalHospitals,
            totalPages,
            inPage: page
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE HOSPITAL".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting the hospitals"
        })
    }

})

router.get('/getHospital/:id', verifyToken, async (req, res) => {
    try {
        const idHospital = await req.params.id
        const getHospital = await Hospital.findById(idHospital).populate('lastUserModifedIt', '_id name email role')

        if(getHospital == null){
            return res.status(400).json({
                ok: "false",
                message: "This hospital doesn't exist"
            });
        }

        res.status(200).json({
            ok: "true",
            hospital: getHospital
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE HOSPITAL".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting the hospital"
        })
    }

})

router.post('/addHospital', verifyToken, async (req, res) => {
    try {
        const { name, img } = req.body
        const lastUserModifedIt = req.tokenPayLoad.user._id

        const createdHospital = await new Hospital({
            name,
            img,
            lastUserModifedIt
        })
        const savedHostpial = await createdHospital.save()

        res.status(201).json({
            ok: "true",
            hospital: savedHostpial
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE HOSPITAL".red, err);
        if (err.errors.name) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.name.properties.message
            });
        }
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while creating the hospital"
        })
    }

})

router.put('/editHospital/:id', verifyToken, async (req, res) => {
    try {
        const { name, img } = req.body
        const id = await req.params.id
        // const lastUserModifedIt = req.tokenPayLoad.user._id

        const modifiedHospital = await Hospital.findByIdAndUpdate({_id: id},{
            name,
            img,
            // lastUserModifedIt
        })
        if(modifiedHospital == null){
            return res.status(400).json({
                ok: "false",
                message: "This hospital doesn't exist"
            });
        }
        const savedHosptial = await modifiedHospital.save()

        return res.status(200).json({
            ok: "true",
            hospital: savedHosptial
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN EDITING THE HOSPITAL".red, err);
        if(err.kind == "ObjectId"){
            return res.status(500).json({
                ok: "false",
                message: "Invalid hospital"
            })
        }
        if (err.errors.name) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.name.properties.message
            });
        }
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while editing the hospital"
        })
    }

})

router.delete("/deleteHospital/:id", verifyToken, async (req, res) => {
    try {
        const id = await req.params.id;

        Hospital.findByIdAndRemove(id, (err, removedHospital) => {
            if (err) {
                throw err
            } else {
                if (removedHospital) {
                    return res.status(200).json({
                        ok: "true",
                        message: removedHospital,
                    });
                }
                return res.status(400).json({
                    ok: "false",
                    message: "This hospital does not exist",
                });
            }
        });
    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE HOSPITAL".red, err);
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE HOSPITAL",
        });
    }
});

module.exports = router