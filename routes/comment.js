const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');
const Comments = require('../models/comments')
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const Like = require('../models/likes')

//get 
//get posts
//Not login 



//create comment
//login
router.post('/create-comment/:id', fetchUser, async (req, res) => {

    try {
        let success = false;
        const userId = req.user.id;
        console.log(userId);
        const { content } = req.body;
        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User' });
        }

        const postId = req.params.id;
        const findPost = await Posts.findById(postId);

        if (!findPost) {
            return res.status(400).json({ success, message: 'InValid Post' });
        }

        console.log('Post For => ', findPost);

        const comment = await Comments.create({
            content: content,
            user: userId,
            postId: postId
        });

        console.log('comment is create SuccessFully.... ', comment);
        findPost.comments.push(comment.id);
        await findPost.save();
        success = true;
        return res.send({ success, comment })

    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Post x x x ' });
    }

})


//delte comments

router.delete('/delete/:id', fetchUser, async (req, res) => {

    try {
        let success = false;
        const userId = req.user.id;

        //  console.log(userId);

        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid Use 1' });
        }

        const commentId = req.params.id;
        const findComment = await Comments.findById(commentId);
        console.log('used id ', userId)
        console.log('findComment=> ', findComment);

        if (findComment.user != userId) {
            return res.status(400).json({ success, message: 'InValid Use 2' });
        }

        const Commet_like_del = await Like.deleteMany({ likeable: commentId });
        const Comment_del = await Comments.deleteOne(findComment);

        console.log('del comment Like SuccessFully....', Commet_like_del);
        console.log('Del Comment SuccessFullly.... ', Comment_del);

        success = true;
        return res.json({ success, message: 'Del Post SuccessFully........' });
    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Post x x x ' });
    }


},)


module.exports = router


module.exports = router;