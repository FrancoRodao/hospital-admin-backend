const jwt = require('jsonwebtoken')


const generateToken = (id) => {
        return new Promise( async ( resolve, reject ) => {
            try{
                const payload = {
                    id,
                };
                const token = await jwt.sign({payload},process.env.SECRET_KEY, 
                                    {expiresIn: 60*60*4})
                resolve(token)

            } catch(error){
                reject(error)
            }
        });

    
}

module.exports = {
    generateToken
}