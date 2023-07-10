require("dotenv").config();
const express = require('express');
const db = require('./db');
const cors = require('cors')

const app=express();
const port=process.env.PORT || 7000;
app.use(express.json());//see req.body on terminal
const bodyParser = require('body-parser');

////////////////////////////Del







/////////////////////////////DEl

app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies
app.use(bodyParser.json());
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))

//  app.use(bodyParser.urlencoded({ extended: false }))

//  app.use(bodyParser.json()) ;
app.use("/uploads",express.static(__dirname+"/uploads"));

//path
app.use('/api/',require('./routes/home'));
//path auth
app.use('/api/auth',require('./routes/auth'));
//path post
app.use('/api/post',require('./routes/post'));
//path comment
app.use('/api/comment',require('./routes/comment'));
//path toggle like of post/comment
app.use('/api/like',require('./routes/like'))
//path send Friend Req , add ,remove ,del
app.use('/api/friends',require('./routes/friends'));
//profile
app.use('/profile',require('./routes/profilepage'));
//
app.use('/api/upload',require('./routes/doc'))


app.listen(port,(err)=>{
      
    if(err){
        console.log('Error in Listen at port 7000 x x x');
    }
    console.log('Hi Bhavesh Sir I am Listen at port no=> 7000 SuccessFully.....');
})

