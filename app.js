//REQUIRES

const colores = require('colors')
const express = require('express')
const moongose = require('mongoose')


//INICIALIZAR VARIABLES

const puerto = 3000

const app = express()

//CONEXION A LA BASE DE DATOS

moongose.connection.openUri('mongodb://localhost/hospitalDB', {
        useUnifiedTopology: true, 
        useNewUrlParser: true
    },
    (err, res) => {
        if (err) {
            console.log("OCURRIO UN ERROR AL CONECTARSE A LA BASE DE DATOS".red, err)
        } else {
            console.log("CONEXION A LA BASE DE DATOS EXITOSA".green)
        }
    })

//RUTAS

app.get('/', (req, res, next) => {
    res.status(200).json({
        "ok": "true",
        "message": "peticion realizada correctamente"
    })
})


//ESCUCHAR PETICIONES

app.listen(puerto, () => {
    console.log("express server puerto:".green, puerto, "online".green)
})