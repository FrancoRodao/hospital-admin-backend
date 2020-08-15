const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    if(!req.headers.authorization) return res.status(401).json({
                                    ok: "false",
                                    message: "Invalid token",
                                });

    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
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