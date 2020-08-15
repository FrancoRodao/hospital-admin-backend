const bcrypt = require('bcrypt')
const User = require('../models/user')
const {googleVerify} = require('../middlewares/googleSignIn')
const { generateToken } = require('../helpers/generateToken')
const getMenuFrontEnd = require('../helpers/menu-frontend')

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
                        user,
                        menu: getMenuFrontEnd(user.role)
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
                user: newUser,
                menu: getMenuFrontEnd(user.role)
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
            user: user,
            menu: getMenuFrontEnd(user.role)
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
        const token = await generateToken(id).catch(err=>{
            return res.status(500).json({
                ok: false,
                message: 'UNEXPECTED ERROR TOKEN'
            });
        });
    
        // Obtener el usuario por UID
        const user = await User.findById( id );
        user.password = undefined
    
        return res.status(200).json({
            ok: true,
            token,
            user,
            menu: getMenuFrontEnd(user.role)
        });
    }catch(e){
        return res.status(400).json({
            ok: false,
            message: 'UNEXPECTED ERROR'
        });
    }

}


module.exports = {
    signin,
    signinGoogle,
    renewToken
}
