const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const Posts = require('../models/posts');
const Like = require('../models/likes')
const Users = require('../models/users');
const Comments = require('../models/comments');
const { compareSync } = require('bcrypt');

//create comment
//login
router.get('/like-toggle', fetchUser, async (req, res) => {

    try {
        let success = false;
    const userId = req.user.id;
    console.log(req.query);
    let likable;
    const id = req.query.id;
    const type = req.query.type;
    if (type == 'Posts') {
        console.log('Heloo Post');
        likable = await Posts.findById(id);
    }
    else {
        console.log('Heloo Comments');
        likable = await Comments.findById(id);
    }
     

    const existingLike = await Like.findOne(
        {
            user: userId,
            likeable:id,
            onModel:type
        }

    )
   // console.log('Exited => ',existingLike);
    if(existingLike){
        console.log('Go Foe Remove Like....');
           likable.likes.pull(existingLike);
           await likable.save();
           const delLike = await Like.deleteOne({ user: existingLike.user,
            likeable:existingLike.likeable,
            onModel:existingLike.onModel
           });

           console.log('Like is Remove SuccessFully....');
        
    }
    else{
        const createLike = await Like.create({        
            user: userId,
            likeable:id,
            onModel:type
        });

        likable.likes.push(createLike);
        await likable.save();
       
       // console.log('Like is Created SuccessFully.... ',createLike);
        console.log('Like is Created SuccessFully.... ');
    }

    success=true;
    res.json({success,message:"Like SuccessFully...."});

    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Post x x x ' });
    }

})


module.exports = router;