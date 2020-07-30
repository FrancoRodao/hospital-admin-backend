const Hospital = require('../models/hospital')

const createHospital = async (req, res) => {
    try {
        const { name, img } = req.body
        const lastUserModifedIt = req.tokenPayLoad.payload.id

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

}

const editHospital = async (req, res) => {
    try {

        const { name, img, _id } = req.body
        const lastUserModifedIt = req.tokenPayLoad.payload.id

        //check if exist a hospital with same name
        const checkName = await Hospital.findOne({name})


        if(checkName){
            if(checkName._id != _id){
                return res.status(400).json({
                    ok: "false",
                    message: 'The name is already register, please use another'
                });
            }
        }
        
        const modifiedHospital = await Hospital.findById({_id})
        if(modifiedHospital == null){
            return res.status(400).json({
                ok: "false",
                message: "This hospital doesn't exist"
            });
        }

        modifiedHospital.name = name
        modifiedHospital.img = img
        modifiedHospital.lastUserModifedIt = lastUserModifedIt
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
    
}

const deleteHospital = async (req, res) => {
    try {
        const id = await req.params.id;
        
        const removedHospital = await Hospital.findByIdAndDelete(id)

        if(removedHospital == null){
            return res.status(400).json({
                ok: "false",
                message: "This hospital does not exist",
            });
        }

        return res.status(200).json({
            ok: "true",
            message: removedHospital,
        });

    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE HOSPITAL".red, err);
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE HOSPITAL",
        });
    }
};


const getHospitals = async (req, res) => {
    try {

        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        
        const paginate = await Hospital.paginate({  },{limit: limit,page: page})
        
        if(paginate.page > paginate.totalPages){
            return res.status(400).json({
                ok: 'false',
                message: `There are only ${paginate.totalPages} pages`
            })
        }
        
        return res.status(200).json({
            ok: "true",
            hospitals: paginate.docs,
            total: paginate.totalDocs,
            totalPages: paginate.totalPages,
            inPage: paginate.page,
            limit: paginate.limit
        });

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE HOSPITAL".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting the hospitals"
        })
    }

}


// router.get('/getHospital/:id', verifyToken, async (req, res) => {
//     try {
//         const idHospital = await req.params.id
//         const getHospital = await Hospital.findById(idHospital).populate('lastUserModifedIt', '_id name email role')

//         if(getHospital == null){
//             return res.status(400).json({
//                 ok: "false",
//                 message: "This hospital doesn't exist"
//             });
//         }

//         res.status(200).json({
//             ok: "true",
//             hospital: getHospital
//         });

//     } catch (err) {
//         console.log("AN ERROR HAPPENED WHEN CREATING THE HOSPITAL".red, err);
//         return res.status(500).json({
//             ok: "false",
//             message: "An unexpected error occurred while getting the hospital"
//         })
//     }

// })

module.exports = {
    createHospital,
    editHospital,
    deleteHospital,
    getHospitals
}