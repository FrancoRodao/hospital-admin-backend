const bcrypt = require('bcrypt')
const User = require('../models/user')
const {googleVerify} = require('../middlewares/googleSignIn')
const { generateToken } = require('../helpers/generateToken')

const signin = async (req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(user != null){
            if(await bcrypt.compare(password, user.password)){
                const token = await generateToken(user._id)
                return res.status(200).json({
                    ok: "true",
                    message: {
                        token: token,
                        user
                    },
                });
            }   
        }
        return res.status(400).json({
            ok: "false",
            message: "Wrong credentials",
        });
    
    }catch(err){
        console.log(err)
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN LOGIN",
        });
    }

}

//GOOGLE SIGN


const signinGoogle = async (req,res)=>{

    try{
        const googleToken = req.body.token
        const googleUser = await googleVerify(googleToken).catch(e => {
            return res.status(401).json({
                ok: "false",
                message: "Invalid token",
            });
        })
        
        const user = await User.findOne({email: googleUser.email})
        if(user == null){
            const {name,email} = googleUser
            const newUser = await new User({
                name,
                email,
                password: ':)',
                img: googleUser.picture,
                google: true 
            })
    
            const newUsergenerated = await newUser.save()

            const token = await generateToken(newUsergenerated._id)
 
            res.status(201).json({
                ok: "true",
                _id: newUser._id,
                token,
                user: newUser
            });
        }
        if(user.google == false){
            return res.status(401).json({
                ok: "false",
                message: "your already register with this email, please login without google",
            });
        }

        const token = await generateToken(user)
        return res.status(200).json({
            ok: "true",
            _id: user._id,
            token,
            user: user
        });
    }catch(err){
        if(err.errors.email){
            return res.status(500).json({
                ok: "false",
                message: err.errors.email.properties.message,
            });
        }else{
            return res.status(500).json({
                ok: "false",
                message: "AN UNEXPECTED ERROR HAPPENED WHEN LOGIN",
            });
        }
    }
}

const renewToken = async(req, res = response) => {

    try{
        const id = req.tokenPayLoad.payload.id;

        // Generar el TOKEN - JWT
        const token = await generateToken(id);
    
        // Obtener el usuario por UID
        const user = await User.findById( id );
        user.password = undefined
    
        return res.status(200).json({
            ok: true,
            token,
            user,
        });
    }catch(e){
        return res.status(400).json({
            ok: false,
            message: 'UNEXPECTED ERROR'
        });
    }

}

// router.post('/registergoogle', async (req,res)=>{

//     try{
//         const googleToken = req.body.token
//         const googleUser = await Hospital(googleToken).catch(e => {
//             return res.status(401).json({
//                 ok: "false",
//                 message: "Invalid token",
//             });
//         })

//         const {name,email,picture} = googleUser

//         const newUser = await new User({
//             name,
//             email,
//             password: ':)',
//             img: picture,
//             google: true 
//         })

//         await newUser.save()

//         res.status(201).json({
//             ok: "true",
//             user: newUser
//         });

//     }catch(err){
//         if(err.errors.email){
//             return res.status(500).json({
//                 ok: "false",
//                 message: err.errors.email.properties.message,
//             });
//         }
//         return res.status(500).json({
//             ok: "false",
//             message: err,
//         });
//     }

// })


module.exports = {
    signin,
    signinGoogle,
    renewToken
}
