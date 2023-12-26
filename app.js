const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")

// Load all the routes
const UsersRoute = require("./routes/user")
const QueryDetailsRoute = require("./routes/query")
const ContactDetailsRoute = require("./routes/contact")
const SubscribeusersRoute = require("./routes/subscribeusers")

// Database Configaration
mongoose.connect('mongodb+srv://sahilmallick:sahilmallick9635@sahilmallick.yawwcxk.mongodb.net/?retryWrites=true&w=majority')
// Checking Mondo DB connection
mongoose.connection.on('error', err => {
    console.log("Connection Failed..Please Try Again");
})
mongoose.connection.on('connected', connected => {
    console.log("Connection Successfully..You can Use this MongoDb Now");
})


const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
};
app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use("/users", UsersRoute);
app.use("/querydetails", QueryDetailsRoute);
app.use("/contactdetails", ContactDetailsRoute);
app.use("/Subscribeusers", SubscribeusersRoute);






// Testing
app.use((req, res, next) => {
    res.status(200).json({
        message: "Welcome to the Academia Crafter Organization",
    })
})

module.exports = app