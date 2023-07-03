const mongoose=require('mongoose');
const LikeSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    likeable:{
        type:mongoose.Schema.ObjectId,
        require:true,
        refPath:'onModel'
    },
    //dynamicaly select obj
    onModel:{
        type:String,
        require:true,
        enum:['Posts','Comments']
    }
},
{
    timestamps:true
});

const Like= mongoose.model('Like',LikeSchema);
module.exports=Like;