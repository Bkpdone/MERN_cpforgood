const mongoose =require('mongoose')
const { Schema } = mongoose;

const ImagePostSchema = new Schema({

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
            ref: 'Posts'
        }
    ],
    date: { type: Date, default: Date.now },

});

const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts