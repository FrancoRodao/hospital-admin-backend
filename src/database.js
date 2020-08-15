const moongose = require('mongoose')

moongose.connection.openUri('mongodb+srv://Franco:Francocjs12@cluster0.6z7yz.mongodb.net/test', {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
},
(err, res) => {
    if (err) {
        console.log("OCURRIO UN ERROR AL CONECTARSE A LA BASE DE DATOS".red, err)
    } else {
        console.log("CONEXION A LA BASE DE DATOS EXITOSA".green)
    }
})