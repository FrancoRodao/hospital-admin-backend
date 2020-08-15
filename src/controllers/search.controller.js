
const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user')
const doctor = require('../models/doctor')

const searchAll = async (req, res) => {
    try {
        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1

        const term = req.params.term
        let regexname = new RegExp(term, 'i')
        const regexemail = new RegExp(term, 'i')

        const paginateUser = await User.paginate({ $or: [{ name: regexname }, { email: regexemail }] }, { limit: limit, page: page, select: '_id name email role img' })
        const paginateDoctors = await Doctor.paginate({ name: regexname }, { limit: limit, page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img' }) })
        const paginateHospitals = await Hospital.paginate({ name: regexname }, { limit: limit, page: page, populate: ({ path: 'lastUserModifedIt', select: '_id name email role img' }) })
        const totalPage = Math.max(paginateDoctors.totalPages, paginateHospitals.totalPages, paginateUser.totalPages)

        if (page > totalPage) {
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

    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN SEARCHING".red, err)
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while searching"
        })
    }

}

const searchInCollections = async (req, res) => {
    const collection = req.params.collection;
    const term = req.params.term;

    let limit = Number(req.query.limit) || 5
    let page = Number(req.query.page) || 1

    if ((page || limit) < 0 || !Number.isInteger(limit) || !Number.isInteger(page)) {
        return res.status(400).json({
            ok: false,
            message: 'limit and page must be a positive and integer number'
        });
    }

    let data = [];

    let regexname = new RegExp(term, 'i')
    let regexemail = new RegExp(term, 'i')

    switch (collection) {
        case 'doctors':

            const paginateDoctors = await Doctor.paginate({
                name: regexname
            }, {
                limit: limit, page: page,
                populate: ({
                    path: 'hospital'
                })
            })
            
            if(paginateDoctors.docs.length <= 0){
                const paginateDoctorsHospitals = await Hospital.paginate({
                    name: regexname
                }, {
                    limit: limit, page: page,
                    populate: ({
                        path: 'doctors',
                        populate: 'hospital'
                    })
                })

                let doctorsToSend = [];
                for (let index = 0; index < paginateDoctorsHospitals.docs.length; index++) {
                    let doctors = paginateDoctorsHospitals.docs[index].doctors
                    for (let index = 0; index < doctors.length; index++) {
                        const element = doctors[index];
                        doctorsToSend.push(element)
                        
                    }
                }

                data = {
                    doctors: doctorsToSend,
                    total: paginateDoctorsHospitals.totalDocs,
                    totalPages: paginateDoctorsHospitals.totalPages,
                    inPage: paginateDoctorsHospitals.page,
                    limit: paginateDoctorsHospitals.limit
                }
            }else{
                data = {
                    doctors: paginateDoctors.docs,
                    total: paginateDoctors.totalDocs,
                    totalPages: paginateDoctors.totalPages,
                    inPage: paginateDoctors.page,
                    limit: paginateDoctors.limit
                }
            }

            break;

        case 'hospitals':

            const paginateHospitals = await Hospital.paginate({
                name: regexname
            }, {
                limit: limit, page: page,
                populate: ({
                    path: 'lastUserModifedIt',
                    select: '_id name email role img'
                })
            })

            if (paginateHospitals.page > paginateHospitals.totalPages) {
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
            const paginateUsers = await User.paginate({
                $or: [{
                    name: regexname
                }, { email: regexemail }]
            },
                {
                    limit: limit,
                    page: page,
                    select: '_id name email role google img'
                })

            if (paginateUsers.page > paginateUsers.totalPages) {
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



