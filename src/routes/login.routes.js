const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.post('/signin', async (req,res)=>{

    try{
        const {email,password} = await req.body
    
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

module.exports = router
