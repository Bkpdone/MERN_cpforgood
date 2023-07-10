const mongoose = require('mongoose')
const { Schema } = mongoose;


const multer = require('multer');
const path = require('path');
const Photos_Path = path.join('/uploads/avatar');



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
        require: true,
    },
    maxRank:{
        type: String,
        require: true,
    },
    avatar: {
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
    doc:[{
        originalName:  String,
        mimeType: String,
        path:  String,
    }],
    date: { type: Date, default: Date.now },

});




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
        cb(null, path.join(__dirname,"..", Photos_Path));
    },
    filename: function (req, file, cb) {
        console.log('Helooo File ',file);
        cb(null,file.fieldname + '-' + Date.now())
    }
  })
  
  UsersSchema.statics.UpdatePhoto= multer({ storage: storage }).single('avatar');
  UsersSchema.statics.PhotosPath=Photos_Path;
  

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users