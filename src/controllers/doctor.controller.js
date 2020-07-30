const Doctor = require('../models/doctor')

const createDoctor = async (req, res) => {
    try {
        const { name, img, hospital } = req.body
        const lastUserModifedIt = req.tokenPayLoad.payload.id

        const createdDoctor = new Doctor({
            name,
            img,
            hospital: hospital.name,
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


        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        
        const paginate = await Doctor.paginate({  },{limit: limit,page: page})
        
        if(paginate.page > paginate.totalPages){
            return res.status(400).json({
                ok: 'false',
                message: `There are only ${paginate.totalPages} pages`
            })
        }
        
        return res.status(200).json({
            ok: "true",
            doctors: paginate.docs,
            total: paginate.totalDocs,
            totalPages: paginate.totalPages,
            inPage: paginate.page,
            limit: paginate.limit
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
        const id = req.params.id
        const lastUserModifedIt = await req.tokenPayLoad.payload.id

        const modifiedDoctor = await Doctor.findById(id)

        if(!modifiedDoctor){
            return res.status(400).json({
                ok: "false",
                message: "This doctor doesn't exist"
            });
        }

        modifiedDoctor.name = name
        modifiedDoctor.img = img
        modifiedDoctor.hospital = hospital
        modifiedDoctor.lastUserModifedIt = lastUserModifedIt
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