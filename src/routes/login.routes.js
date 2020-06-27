const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

router.post('/signin', async (req,res)=>{

    try{
        const {email,password} = req.body
    
        User.findOne({email}, async (err,user)=>{
            if(err){
                throw err
            }else{
                if(user){
                    if(!await bcrypt.compare(password, user.password)){
                        return res.status(400).json({
                            ok: "false",
                            message: "Wrong credentials",
                        });

                    }
                    user.password = undefined
                    const token = await jwt.sign({user},process.env.SECRET_KEY, {expiresIn: 60*60*4})
                    return res.status(200).json({
                        ok: "true",
                        message: {
                            token: token
                        },
                    });
                }
                return res.status(400).json({
                    ok: "false",
                    message: "Wrong credentials",
                });
            }
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN LOGIN",
        });
    }

})

//GOOGLE SIGN

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const {name,email,picture} = payload
    return {
        name,
        email,
        picture,
        google: true
    }
  }

router.post('/logingoogle', async (req,res)=>{

    try{
        const googleToken = req.body.token
        const googleUser = await verify(googleToken).catch(e => {
            return res.status(401).json({
                ok: "false",
                message: "Invalid token",
            });
        })
        
        const user = await User.findOne({email: googleUser.email})
        if(user == null){
            return res.status(200).json({
                ok: "false",
                message: "this user doesn't exists"
            });
        }
        if(user.google == false){
            return res.status(400).json({
                ok: "false",
                message: "You are not registered with google",
            });
        }

        user.password = undefined
        const token = await jwt.sign({user},process.env.SECRET_KEY, {expiresIn: 60*60*4})

        return res.status(200).json({
            ok: "true",
            message: googleUser
        });
    }catch(err){
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN LOGIN",
        });
    }
})

router.post('/registergoogle', async (req,res)=>{

    try{
        const googleToken = req.body.token
        const googleUser = await verify(googleToken).catch(e => {
            return res.status(401).json({
                ok: "false",
                message: "Invalid token",
            });
        })

        const {name,email,picture} = googleUser

        const newUser = await new User({
            name,
            email,
            password: ':)',
            img: picture,
            google: true 
        })

        await newUser.save()

        res.status(201).json({
            ok: "true",
            user: newUser
        });

    }catch(err){
        if(err.errors.email){
            return res.status(500).json({
                ok: "false",
                message: err.errors.email.properties.message,
            });
        }
        return res.status(500).json({
            ok: "false",
            message: err,
        });
    }

})


module.exports = router
