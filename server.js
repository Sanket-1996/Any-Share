const express = require('express');
const app = express();
const path = require('path');

const connectDB = require('./config/db');
connectDB();
// .env file and server must be in root folder or same folder.
// Here we import and tell our server that we has created connection with database.

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));  
// Template engine 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')

app.use(express.json());

// Routes
app.use('/api/files', require('./routes/files'));

// now we are creating the endpoint for getting the uploaded file by unique url and uuid
app.use('/files', require('./routes/show'))

// Now we are creating route for download
app.use('/files/download', require('./routes/download'));


app.listen(PORT, () => {
    console.log(`Listening at ${PORT}.`);
});

// Here we creatted the server.