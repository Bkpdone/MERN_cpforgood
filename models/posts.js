const mongoose =require('mongoose')
const { Schema } = mongoose;


///
const multer = require('multer');
const path = require('path');
const Photos_Path = path.join('/uploads/posts');

const PostsSchema = new Schema({
    
    content: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    likes :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments'
        }
    ],
    postImage:{
        type: String,
        require: true,
    },
    imgdata:{
        type: String,
    },
    date: { type: Date, default: Date.now },

},
{
    timestamps:true
});





//////////////////////////////////////////


// const PostPhotoSchema=new mongoose.Schema({

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  
      cb(null, path.join(__dirname,"..", Photos_Path));
  },
  filename: function (req, file, cb) {
      console.log('Helooo File ',file);
      cb(null,file.fieldname + '-' + Date.now())
  }
})

PostsSchema.statics.UpdatePhoto= multer({ storage: storage }).single('imgdata');
PostsSchema.statics.PhotosPath=Photos_Path;


// const PostPhoto=mongoose.model('PostPhoto',PostPhotoSchema);

// module.exports=PostPhoto;


const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts