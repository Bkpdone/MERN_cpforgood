const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');
const Comments = require('../models/comments')
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const Like = require('../models/likes');
const { compareSync } = require('bcrypt');
const upload = require('../middleware/upload')
const fs = require('fs');
const path = require('path');

//get 
//get posts
//Not login 



//create post
//login
router.post('/create-post', fetchUser, async (req, res, file) => {

    try {
        let success = false;
        const userId = req.user.id;
        console.log(userId);
        const { content } = req.body;
        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User' });
        }




        const obj = {
            content: content,
            user: userId,
            imgdata: ''
        };


        const post = await Posts.create(obj);


        Posts.UpdatePhoto(req, res, function () {




            if (req.file) {
                post.imgdata = req.file.filename;
            }
            post.save();

            console.log('create post SuccessFully.............................................', post);
            success = true
            return res.json({ success, postval: post.id, post });
            //  console.log('Hi Bhavesh Photo Update SuccessFully....................',post);
        })

     
    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Post x x x ' });
    }

})
/////////////////////////////////////////////////////





router.post('/create-post-2', fetchUser, async (req, res) => {

    try {
        let success = false;
        const userId = req.user.id;
        console.log(userId);
        const { content, imgval, postval } = req.body;
        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User' });
        }
        console.log('Valllllllll tttttt=> ', postval, content, imgval);
        const del_post = await Posts.findByIdAndDelete(postval);

        console.log('Hi Bhavesh Delete post SuccessFully............', del_post);
       
        const post=Posts.create({
            content: content,
            imgdata: imgval,
            user:userId,
        })
         
        console.log('create post SuccessFully.............................................', post);
        return res.json({del_post})

    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ message: 'Internal Error in Create Post x x x ' });
    }

})


//delete post
//login
//remaining aahe work
router.delete('/delete/:id', fetchUser, async (req, res) => {

    try {
        let success = false;
        const userId = req.user.id;

      

        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid Use 1' });
        }

        const postId = req.params.id;
        const findPost = await Posts.findById(postId);
        console.log('find User id+> ',findPost);
        console.log('ppp=> ',userId);
        if (findPost.user != userId) {
            return res.status(400).json({ success, message: 'InValid User 2' });
        }
        const filename=findPost.imgdata;

        const filePath=path.join(__dirname,'..',`/uploads/posts/${filename}`)
        ////////////////////////////
        fs.unlink(filePath, function(err) {
            if (err) {
              console.error('Error deleting the image file:', err);
              return;
            }
          
            console.log('Image file deleted successfully');
          
          
          });
        ////////////////////////////

        for (let val of findPost.comments) {
            const like_del_id = val
            const Comment_like_Del = await Like.deleteMany({ likeable: like_del_id });
            console.log('Comment Like Deleted SuccessFully....', Comment_like_Del);
        }
        const Post_LIke_Del = await Like.deleteMany({ likeable: postId });
        const Comment_Dal = await Comments.deleteMany({ postId: req.params.id });

        const Post_Del = await Posts.deleteOne(findPost);

        console.log('Delete Comments SuccessFully.....', Comment_Dal);
        console.log('Delete Post SuccessFully.....', Post_LIke_Del);
        success = true;
        return res.json({ success, message: 'Del Post SuccessFully........' });
    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Post x x x ' });
    }


},)


module.exports = router