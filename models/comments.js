const mongoose =require('mongoose')
const { Schema } = mongoose;

const CommentsSchema = new Schema({

    content: {
        type: String,
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    date: { type: Date, default: Date.now },

});

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments