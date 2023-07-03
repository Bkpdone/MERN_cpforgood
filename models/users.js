const mongoose = require('mongoose')
const { Schema } = mongoose;

const UsersSchema = new Schema({

    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unquie: true
    },
    password: {
        type: String,
        require: true,
    },
    cfname: {
        type: String,
//        require: true,
    },
    cfData:{
        type:Object
    },
    phone:{
        type: String,
     
    },
    about: {
        type: String,

    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts'
        }
    ],
    maxRating:{
        type: String,
    },
    maxRank:{
        type: String,
    },
    avatr: {
        type: String,
        require: true,
    },
    relations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friends'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friends'
    }],
  
    date: { type: Date, default: Date.now },

});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users