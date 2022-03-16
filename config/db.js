require('dotenv').config()
// Here we required this for privacy protection.

const { ConnectionCheckedInEvent } = require('mongodb');
const mongoose = require('mongoose');


function connectDB() {
    //Database connection 

    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true});
    // Here we need to keep the url as a secreate bcz it contain our id and password of the database we use dotenv.
    // NOTE: mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true}); This is new snipt for connection.

    
    const connection = mongoose.connection;
    // Here we store a connection and we check any error is present or not.

    connection.once('open', ()=>{

        console.log('Database Connected.');

    }).on('error', err => {

        console.log('Connection Failed')
        
    })
    

}
 
module.exports = connectDB;