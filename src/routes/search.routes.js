const Router = require("express").Router();
const verifyToken = require('../middlewares/verifyToken')
const  { searchAll, searchInCollections } = require('../controllers/search.controller')


Router.get('/search/all/:term', [verifyToken], searchAll)

Router.get('/search/:collection/:term', [verifyToken], searchInCollections)

module.exports = Router