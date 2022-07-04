const http = require('http')
const {isCelebrateError } = require('celebrate')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express');
const app = express()
const Calculate = require('./controllers/calculateSplit')
const { errorResponse, successResponse } = require( './controllers/splitResponse')
const { validateTransactionObject } = require('./controllers/splitValidator')
require('dotenv').config()


app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
// middleware to parse json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes

app.get('/', (req, res) => {
    return res.status(200).json({
      message: 'LannisterPay transaction payment splitting service (TPSS) API',
    })
  })

  app.post('/split-payments/compute', validateTransactionObject(), async (req, res) => {
    const result = Calculate(req.body)
    return successResponse(res, result)
  })
  
  app.use('*', (req, res) => {
    return errorResponse(res, 'Route / Method not supported', 404)
  })

  app.use((error, _req, res, next) => {
    if (isCelebrateError(error)) {
      const errorMessage = error.details.get('body') || error.details.get('query') || error.details.get('params')
  
      const message = errorMessage?.message.replace(/"/g, '')
      return errorResponse(res, message)
    }
    next()
  })
  

const port = process.env.PORT || 5000
const server = http.createServer(app)
server.listen(port, ()=>{
    console.log(`server is listening on port ${port} `)
})
