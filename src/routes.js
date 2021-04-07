const { Router } = require('express')

const AdsController = require('./controllers/AdsController')
const UnbounceController = require('./controllers/UnbounceController')

const routes = Router()

routes.get('/ads', AdsController.index)
routes.get('/ads/leads', AdsController.leads)
routes.get('/ads/cleanup', AdsController.clean)

routes.get('/unbounce', UnbounceController.index)

module.exports = routes
