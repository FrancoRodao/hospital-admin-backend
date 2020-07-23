const bcrypt = require("bcrypt");
const User = require("../models/user");
var ObjectId = require('mongoose').Types.ObjectId;


// router.put('/changeRole/:id', verifyToken, async (req, res) => {
//     try {
//         const id = req.params.id
//         const role = req.body.role

//         const userFinded = await User.findById(id)

//         if (!userFinded) {
//             return res.status(400).json({
//                 ok: "false",
//                 message: "This user does not exist",
//             });
//         }

//         userFinded.role = role
//         const saveUser = await userFinded.save()

//         return res.status(200).json({
//             ok: "true",
//             message: saveUser,
//         });


//     } catch (err) {
//         console.log("AN UNEXPECTED ERROR HAPPENED WHEN CHANGE ROLE".red, err);
//         return res.status(500).json({
//             ok: "false",
//             message: "AN UNEXPECTED ERROR HAPPENED WHEN CHANGE ROLE",
//         });
//     }
// })

const createUser = async (req, res) => {
    try {
        const { name, email, password, img, role } = await req.body;

        const emailExists = await User.findOne({email})
        if(emailExists){
            return res.status(400).json({
                ok: "false",
                message: 'This email is already registered, please use another',
            });
        }

        const usuario = await new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            img,
            role
        });
        const userSave = await usuario.save();

        res.status(201).json({
            ok: "true",
            user: userSave,
            tokenPayLoad: req.tokenPayLoad
        });
    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE USER".red, err);

        if (err.errors.role) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.role.properties.message,
            });
        } else {
            return res.status(500).json({
                ok: "false",
                message: "an unexpected error occurred while creating the user",
            });
        }
    }
}

const editUser = async (req, res) => {
    try {
        if(!ObjectId(req.body.id)){
            return res.status(400).json({
                ok: "false",
                message: 'invalid id',
            });
        }

        const id = await req.body.id;


        const name = await req.body.name
        const userFinded = await User.findById(id)

        if (!userFinded) {
            return res.status(400).json({
                ok: "false",
                message: "This user doesn't exist"

            });
        }
        if (userFinded.google == true) {
            userFinded.name = name
            const userSaved = await userFinded.save()
            return res.status(200).json({
                ok: "true",
                user: userSaved
            });
        }

        if(req.body.email == undefined || null){
            return res.status(400).json({
                ok: false,
                message: 'email is required'
            })
        }

        const { email, password, confirmPassword } = await req.body;

        const emailExists = await User.findOne({email})
        if(emailExists){
            if(id != emailExists._id){
                return res.status(400).json({
                    ok: "false",
                    message: 'This email is already registered, please use another',
                });
            }

        }

        if (password == confirmPassword) {
            userFinded.name = name
            userFinded.email = email
            userFinded.password = await bcrypt.hash(password, 10)
            const userSaved = await userFinded.save()

            userFinded.password = undefined
            return res.status(200).json({
                ok: "true",
                user: userSaved
            });

        } else {
            return res.status(400).json({
                ok: "false",
                message: "Passwords are not the same, check them",
            });
        }

    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN EDITING THE USER".red, err);
        return res.status(500).json({
            ok: "false",
            message: err,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = await req.params.id;

        User.findByIdAndRemove(id, (err, removedUser) => {
            if (err) {
                throw err
            } else {
                if (removedUser) {
                    return res.status(200).json({
                        ok: "true",
                        message: removedUser,
                    });
                }
                return res.status(400).json({
                    ok: "false",
                    message: "This user does not exist",
                });
            }
        });
    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE USER".red, err);
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE USER",
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const search = req.params.search
        const regexname = new RegExp(search, 'i')
        const regexemail = new RegExp(search, 'i')

        let limit = Number(req.query.limit) || 5
        let page = Number(req.query.page) || 1

        const paginate = await User.paginate({ $or: [{ name: regexname }, { email: regexemail }] }, { limit: limit, page: page, select: '_id name email role google img' })

        if (paginate.page > paginate.totalPages) {
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

    } catch (err) {
        console.log("AN ERROR OCCURRED IN OBTAINING USERSS".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting users",
        });
    }
}

// const getUser = async (req, res) => {
//     try {
//         const idUser = await req.params.id
//         const getUser = await Hospital.findById(idUser)

//         res.status(200).json({
//             ok: "true",
//             user: getUser
//         });

//     } catch (err) {
//         console.log("AN ERROR HAPPENED WHEN CREATING THE USER".red, err);
//         return res.status(500).json({
//             ok: "false",
//             message: "An unexpected error occurred while getting the user"
//         })
//     }

// }

module.exports = {
    createUser,
    editUser,
    deleteUser,
    getUsers
    // getUser,
};
