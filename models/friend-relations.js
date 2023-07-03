
const mongoose=require('mongoose');

const FriendsSchema=new mongoose.Schema({

    oneId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    twoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
  
},
{
    timestamps:true
});

const Friends= mongoose.model('Friends',FriendsSchema);
module.exports=Friends;