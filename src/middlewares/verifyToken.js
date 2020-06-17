const jwt = require('jsonwebtoken')
const colores = require('colors')

function verifyToken(req,res,next){
    const token = req.query.token

    jwt.verify(token, process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok: "false",
                message: "Invalid token",
            });
        }
        
        req.tokenPayLoad = decoded
        next()
    })
}

module.exports = verifyToken