
const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGOBD_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(console.log("DB connected successfully"))
    .catch( (error) =>{
        console.log("DB connection issues");
        console.error(error);
        process.exit(1);
    })
}