//PRODUCTION OR DEVELOPMENT ENVAROIMENT
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//REQUIRES

const colors = require('colors')
const express = require('express')
const path = require('path')
const cors = require('cors')


//INICIALIZAR VARIABLES

const port = process.env.PORT
const app = express()


//MIDDLEWARES

app.use(express.json())
app.use(cors())

//CONEXION A LA BASE DE DATOS

require('./database')

//RUTAS
app.use("/uploads/images", express.static(path.resolve('uploads/images')))
app.use('/api', require('./routes/users.routes'))
app.use('/api', require('./routes/login.routes'))
app.use('/api', require('./routes/hospitals.routes'))
app.use('/api', require('./routes/doctor.routes'))
app.use('/api', require('./routes/search.routes'))
app.use('/api', require('./routes/images.routes'))


//ESCUCHAR PETICIONES

app.listen(process.env.PORT || 3000, () => {
    console.log("express server puerto:".green, port, "online".green)
})