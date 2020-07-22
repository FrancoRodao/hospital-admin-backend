const Doctor = require('../models/doctor')

const createDoctor = async (req, res) => {
    try {
        const { name, img, hospital } = req.body
        const lastUserModifedIt = req.tokenPayLoad.user._id

        const createdDoctor = new Doctor({
            name,
            img,
            hospital,
            lastUserModifedIt
        })

        createdDoctor.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    ok: "false",
                    message: "Invalid hospital"
                });
            }
            res.status(201).json({
                ok: "true",
                doctor: product
            });
        })


    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE Doctor".red, err);
        if (err.errors.name) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.name.properties.message
            });
        }
        if (err.errors.hospital) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.hospital.properties.message
            });
        }
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while creating the doctor"
        })
    }

}

const getDoctors = async (req, res) => {
    try {

        const limit = Number(await req.query.limit || 5)
        const page = Number(await req.query.page || 0)
        const total = await Doctor.countDocuments()
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

        const getDoctors = await Doctor.find({})
        .populate("lastUserModifedIt", 'name')
        .limit(limit)
        .skip(page*limit);

        res.status(200).json({
            ok: "true",
            doctors: getDoctors,
            total,
            totalPages,
            inPage: page
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE DOCTORS".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting the DOCTORS"
        })
    }
    
}

const editDoctor = async (req, res) => {
    try {
        const { name, img, hospital } = await req.body
        const id = await req.params.id
        const lastUserModifedIt = await req.tokenPayLoad.user._id

        const modifiedDoctor = await Doctor.findByIdAndUpdate({_id: id},{
            name,
            img,
            hospital,
            lastUserModifedIt
        })

        if(!modifiedDoctor){
            return res.status(400).json({
                ok: "false",
                message: "This doctor doesn't exist"
            });
        }

        const savedDoctor = await modifiedDoctor.save()

        return res.status(200).json({
            ok: "true",
            doctor: savedDoctor
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN EDITING THE Doctor".red, err);
        if(err.kind == "ObjectId"){
            return res.status(500).json({
                ok: "false",
                message: "Invalid doctor or hospital"
            })
        }
        if (err.errors.name) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.name.properties.message
            });
        }
        if (err.errors.hospital) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.hospital.properties.message
            });
        }
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while editing the doctor"
        })
    }

}

const deleteDoctor =  async (req, res) => {
    try {
        const id = await req.params.id;

        const deleteDoctor = await Doctor.findByIdAndRemove(id)

        if(!deleteDoctor){
            return res.status(400).json({
                ok: "false",
                message: "This doctor doesn't exist"
            });
        }

        return res.status(200).json({
            ok: "true",
            doctor: deleteDoctor
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN EDITING THE Doctor".red, err);
        if(err.kind == "ObjectId"){
            return res.status(500).json({
                ok: "false",
                message: "Invalid doctor"
            })
        }
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while editing the doctor"
        })
    }
};
// router.get('/getDoctor/:id', verifyToken, async (req, res) => {
//     try {
//         const idDoctor = await req.params.id
//         const getDoctor = await Doctor.findById(idDoctor)
//         .populate('lastUserModifedIt', '_id name email role')
//         .populate('hospital')

//         if(!getDoctor){
//             return res.status(400).json({
//                 ok: "false",
//                 message: "This doctor doesn't exist"
//             });
//         }

//         res.status(200).json({
//             ok: "true",
//             doctor: getDoctor
//         });

//     } catch (err) { 
//         if(err.kind == "ObjectId"){
//             return res.status(500).json({
//                 ok: "false",
//                 message: "Invalid doctor"
//             })
//         }else{
//             return res.status(500).json({
//                 ok: "false",
//                 message: "An unexpected error occurred while getting the doctor"
//             })
//         }


//     }

// })


module.exports = {
    createDoctor,
    editDoctor,
    deleteDoctor,
    getDoctors
}