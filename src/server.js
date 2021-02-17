require('dotenv').config()
const express = require('express')
require('express-async-errors')
const cors = require('cors')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
