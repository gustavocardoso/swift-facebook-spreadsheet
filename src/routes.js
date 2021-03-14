const { Router } = require('express')

const AdsController = require('./controllers/AdsController')

const routes = Router()

routes.get('/ads', AdsController.index)

routes.get('/ads/cleanup', AdsController.clean)

module.exports = routes
