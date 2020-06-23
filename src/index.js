//PRODUCTION OR DEVELOPMENT ENVAROIMENT
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//REQUIRES

const colors = require('colors')
const express = require('express')
const fileUpload = require('express-fileupload')


//INICIALIZAR VARIABLES

const port = process.env.PORT
const app = express()


//MIDDLEWARES

app.use(express.json())
app.use(fileUpload());

//CONEXION A LA BASE DE DATOS

require('./database')

//RUTAS

app.use('/api', require('./routes/users.routes'))
app.use('/api', require('./routes/login.routes'))
app.use('/api', require('./routes/hospital.routes'))
app.use('/api', require('./routes/doctor.routes'))
app.use('/api', require('./routes/search.routes'))
app.use('/api', require('./routes/upload.routes'))


//ESCUCHAR PETICIONES

app.listen(port || 3000, () => {
    console.log("express server puerto:".green, port, "online".green)
})