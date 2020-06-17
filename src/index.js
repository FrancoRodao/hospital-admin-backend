//PRODUCTION OR DEVELOPMENT ENVAROIMENT
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//REQUIRES

const colors = require('colors')
const express = require('express')


//INICIALIZAR VARIABLES

const port = process.env.PORT
const app = express()


//MIDDLEWARES
app.use(express.json())

//CONEXION A LA BASE DE DATOS

require('./database')

//RUTAS

app.use('/api', require('./routes/users.routes'))
app.use('/api', require('./routes/login.routes'))


//ESCUCHAR PETICIONES

app.listen(port || 3000, () => {
    console.log("express server puerto:".green, port, "online".green)
})