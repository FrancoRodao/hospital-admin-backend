const User = require('../models/user')

const validateADMIN_ROLE = async (req, res, next) => {
    try {
        const id = req.tokenPayLoad.payload.id

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                ok: "false",
                message: "This user doesn't exist"
            });
        }

        if(user.role != 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: "false",
                message: "This user isn't admin"
            });
        }

        next()

    }
    catch (error) {

        return res.status(500).json({
            ok: "false",
            message: "UNEXPECTED ERROR",
        });

    }
}



module.exports = {
    validateADMIN_ROLE
}