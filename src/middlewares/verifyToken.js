const jwt = require('jsonwebtoken')

function verifyToken(req,res,next){
    const token = req.header('x-token')
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