
const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user')

const searchAll = async (req,res)=>{
    try{
        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1

        const term = req.params.term
        let regexname = new RegExp(term, 'i')
        const regexemail = new RegExp(term, 'i')
        
        const paginateUser = await User.paginate({$or: [{name:regexname}, {email: regexemail}]},{limit: limit,page: page,select: '_id name email role img'})
        const paginateDoctors = await Doctor.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})
        const paginateHospitals = await Hospital.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})
        const totalPage = Math.max(paginateDoctors.totalPages,paginateHospitals.totalPages,paginateUser.totalPages)

        if(page > totalPage){
            return res.status(400).json({
                ok: 'false',
                message: `There are only ${totalPage} pages`
            })
        }


        return res.status(200).json({
            ok: "true",
            users: paginateUser.docs,
            doctors: paginateDoctors.docs,
            hospitals: paginateHospitals.docs,
            total: paginateDoctors.totalDocs + paginateUser.totalDocs + paginateHospitals.totalDocs,
            totalPage,
            inPage: page,
            limit
        });

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while searching"
        })
    }

}

const searchInCollections = async (req,res)=>{
    const collection = req.params.collection;
    const term = req.params.term;

    let limit = Number(req.query.limit) || 5
    let page = Number(req.query.page) || 1
    
    if((page || limit) < 0 || !Number.isInteger(limit) || !Number.isInteger(page)){
        return res.status(400).json({
            ok: false,
            message: 'limit and page must be a positive and integer number'
        });
    }

    let data = [];

    let regexname = new RegExp(term, 'i')
    let regexemail = new RegExp(term, 'i')

    switch ( collection ) {
        case 'doctors':
            const paginateDoctor = await Doctor.paginate({$or: [{
                                     name:regexname}, {hospital: regexname}]},{
                                     limit: limit,
                                     page: page, 
                                     populate: ({ 
                                         path: 'lastUserModifedIt', 
                                         select: '_id name email role img'})})

            if(paginateDoctor.page > paginateDoctor.totalPages){
                return res.status(400).json({
                    ok: 'false',
                    message: `There are only ${paginateDoctor.totalPages} pages`
                })
            }
            data = {
                    doctors: paginateDoctor.docs,
                    total: paginateDoctor.totalDocs,
                    totalPages: paginateDoctor.totalPages,
                    inPage: paginateDoctor.page,
                    limit: paginateDoctor.limit
                   }
            break;

        case 'hospitals':

            const paginateHospitals = await Hospital.paginate({
                             name: regexname},{limit: limit,page: page, 
                             populate: ({ 
                                 path: 'lastUserModifedIt', 
                                 select: '_id name email role img'})})

            if(paginateHospitals.page > paginateHospitals.totalPages){
                return res.status(400).json({
                    ok: 'false',
                    message: `There are only ${paginateHospitals.totalPages} pages`
                })
            }

            data = {
                    hospitals: paginateHospitals.docs,
                    total: paginateHospitals.totalDocs,
                    totalPages: paginateHospitals.totalPages,
                    inPage: paginateHospitals.page,
                    limit: paginateHospitals.limit
                    }
            break;

        case 'users':
            const paginateUsers = await User.paginate({$or: [{
                                        name:regexname}, {email: regexemail}]},
                                        {limit: limit,
                                        page: page,
                                        select: '_id name email role google img'})
    
            if(paginateUsers.page > paginateUsers.totalPages){
                return res.status(400).json({
                    ok: 'false',
                    message: `There are only ${paginateUsers.totalPages} pages`
                })
            }

            data = {
                    users: paginateUsers.docs,
                    total: paginateUsers.totalDocs,
                    totalPages: paginateUsers.totalPages,
                    inPage: paginateUsers.page,
                    limit: paginateUsers.limit
                   }
            
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                message: 'Invalid collection [doctors,hospitals,users]'
            });
    }
    
    res.json({
        ok: true,
        message: data
    })

}

module.exports = {
    searchAll,
    searchInCollections
}


// const searchHospitals = async (req,res)=>{
//     try{
    
//         const search = req.params.search
//         const regexname = new RegExp(search, 'i')

//         let limit = Number(req.query.limit) || 5
//         let page = Number(req.query.page) || 1
//         const paginate = await Hospital.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})

//         if(paginate.page > paginate.totalPages){
//             return res.status(400).json({
//                 ok: 'false',
//                 message: `There are only ${paginate.totalPages} pages`
//             })
//         }

//         return res.status(200).json({
//              ok: "true",
//              hospitals: paginate.docs,
//              total: paginate.totalDocs,
//              totalPages: paginate.totalPages,
//              inPage: paginate.page,
//              limit: paginate.limit
//          });

//     }catch(err){
//         console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
//         return res.status(500).json({
//             ok: "false",
//             message: "An unexpected error occurred while searching the hospitals"
//         })
//     }
// }

// const searchUsers = async (req,res)=>{
//     try{
    
//         const search = req.params.search
//         const regexname = new RegExp(search, 'i')
//         const regexemail = new RegExp(search, 'i')

//         let limit = Number(req.query.limit) || 5
//         let page = Number(req.query.page) || 1
//         const paginate = await User.paginate({$or: [{name:regexname}, {email: regexemail}]},{limit: limit,page: page,select: '_id name email role google img'})
    
//         if(paginate.page > paginate.totalPages){
//             return res.status(400).json({
//                 ok: 'false',
//                 message: `There are only ${paginate.totalPages} pages`
//             })
//         }

//         return res.status(200).json({
//              ok: "true",
//              users: paginate.docs,
//              total: paginate.totalDocs,
//              totalPages: paginate.totalPages,
//              inPage: paginate.page,
//              limit: paginate.limit
//          });

//     }catch(err){
//         console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
//         return res.status(500).json({
//             ok: "false",
//             message: "An unexpected error occurred while searching the users"
//         })
//     }
// }

// const searchDoctors = async (req,res)=>{
//     try{
    
//         const search = req.params.search
//         const regexname = new RegExp(search, 'i')

//         let limit = Number(req.query.limit) || 5
//         let page = Number(req.query.page) || 1
//         const paginate = await Doctor.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})

//         if(paginate.page > paginate.totalPages){
//             return res.status(400).json({
//                 ok: 'false',
//                 message: `There are only ${paginate.totalPages} pages`
//             })
//         }

//         return res.status(200).json({
//              ok: "true",
//              doctors: paginate.docs,
//              total: paginate.totalDocs,
//              totalPages: paginate.totalPages,
//              inPage: paginate.page,
//              limit: paginate.limit
//          });

//     }catch(err){
//         console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
//         return res.status(500).json({
//             ok: "false",
//             message: "An unexpected error occurred while searching the doctors"
//         })
//     }
// }


