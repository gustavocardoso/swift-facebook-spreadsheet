const { Router } = require('express')

const AdsController = require('./controllers/AdsController')

const routes = Router()

routes.get('/ads', AdsController.index)

module.exports = routes
