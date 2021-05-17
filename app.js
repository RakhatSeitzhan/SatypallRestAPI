const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productsRouter = require('./api/routes/products')
const usersRouter = require('./api/routes/users')
//jR7PpRziWPkLC2Dh
mongoose.connect('mongodb+srv://GeneralUser:jR7PpRziWPkLC2Dh@cluster0.fnfzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true  })

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/products', productsRouter)
app.use('/users', usersRouter)

app.use('/', (req, res, next) => {
    const error = new Error('Request type not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app