const express = require('express');
const Users = require('../models/users');
const { find } = require('../models/friend-relations');
const Friends = require('../models/friend-relations');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();




router.get('/view/:id',fetchUser,async(req,res)=>{
    

    let success = false;
    const userId = req.user.id;
    const friendId=req.params.id;
    const findUser = await Users.findById(userId);
    if (!findUser) {
        return res.status(400).json({ success, message: 'InValid User 1' });
    };

    const findFriend = await Users.findById(friendId);

    if (!findFriend) {
        return res.status(400).json({ success, message: 'InValid User 2' });
    };
    
    let existFriend=null;
    let oneFriend=[];
    let twoFriend=[];

  
    oneFriend=findUser.friends;
    twoFriend=findFriend.friends;

    for(let f1 of oneFriend){
        for(let f2 of twoFriend){
            // console.log('f1 cccccccccccccccccccccccccccccc=> ',f1);
            // console.log('f2 cccccccccccccccccccccccccccccc=> ',f2);
            const x=f1.toString();
            const y=f2.toString();
            // console.log('f1 xx cccccccccccccccccccccccccccccc=> ',x);
            // console.log('f2 yy cccccccccccccccccccccccccccccc=> ',y);
            if(x==y){
               // console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee=> ok         ');
                existFriend=69;
            }
        }
    }
   
   console.log('Profile iiiiiiiiiiiiiiiiiiiiii+++++ => ',existFriend);
   success=true;
    if(existFriend){
      console.log('Hi Sir True Friend =====> ');
      return res.json({success,findFriend});
    }
    else{
      success=false;
      console.log('Hi Sir Ur Are Not Freind ');
      return res.json({success,data:'Hi Sir You Are Not Firend So Sorry '})
    }

});

module.exports =router;