const express = require('express')
const router = express.Router()
const paginate = require('mongoose-paginate-v2')

const verifyToken = require('../middlewares/verifyToken')
const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user')


//AGREGAR EL VERIFICADOR DE TOKEN
router.get('/collection/all/:search', verifyToken, async (req,res)=>{
    try{
        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        const search = req.params.search
        const regexname = new RegExp(search, 'i')
        const regexemail = new RegExp(search, 'i')
        
        
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

})

router.get('/collection/hospitals/:search', verifyToken, async (req,res)=>{
    try{
    
        const search = req.params.search
        const regexname = new RegExp(search, 'i')

        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        const paginate = await Hospital.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})

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

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while searching the hospitals"
        })
    }
})

router.get('/collection/users/:search', verifyToken, async (req,res)=>{
    try{
    
        const search = req.params.search
        const regexname = new RegExp(search, 'i')
        const regexemail = new RegExp(search, 'i')

        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        const paginate = await User.paginate({$or: [{name:regexname}, {email: regexemail}]},{limit: limit,page: page,select: '_id name email role img'})

        if(paginate.page > paginate.totalPages){
            return res.status(400).json({
                ok: 'false',
                message: `There are only ${paginate.totalPages} pages`
            })
        }

        return res.status(200).json({
             ok: "true",
             users: paginate.docs,
             total: paginate.totalDocs,
             totalPages: paginate.totalPages,
             inPage: paginate.page,
             limit: paginate.limit
         });

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while searching the users"
        })
    }
})

router.get('/collection/doctors/:search', verifyToken, async (req,res)=>{
    try{
    
        const search = req.params.search
        const regexname = new RegExp(search, 'i')

        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1
        const paginate = await Doctor.paginate({name: regexname},{limit: limit,page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img'})})

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

    }catch(err){
        console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while searching the doctors"
        })
    }
})

module.exports = router

