const express = require("express");

const morgan = require("morgan") // for logging

const bodyParser = require("body-parser")

const app = express()

const mongoose = require("mongoose")

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

// middle wares
app.use(morgan('dev')) //terminal logs
app.use('/uploads', express.static('upload'))
app.use(bodyParser.urlencoded({extended: false})); // sending and recieveing requests
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://prudentjag:Ebube%401234@node-shop.yvkncl4.mongodb.net/?retryWrites=true&w=majority",
//   {
//     useMongClient : true
//   }
);

// cors headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({})
    }
    next()
})

app.use('/products' , productRoutes)
app.use('/orders' , orderRoutes)
app.use('/users', userRoutes)

// Error handlers

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status(404);
    next(error)
})

//handles other type of errors e.g db errors

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})


module.exports = app ;