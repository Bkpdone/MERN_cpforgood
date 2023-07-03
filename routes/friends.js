const express = require('express');
const router = express.Router();
const Friends = require('../models/friend-relations');
const Users = require('../models/users');
const fetchUser = require('../middleware/fetchUser');
const SendReq = require('../mailercontroller/Friendreq')


//send friend req
router.get('/send-req/:id', fetchUser, async (req, res) => {
    try {
        let success = false;
        const userId = req.user.id;

        //  console.log(userId);
        const reqId = req.params.id;
        const findone = await Users.findById(userId);
        if (!findone) {
            return res.status(400).json({ success, message: 'InValid Use 1' });
        }
        const findUser = await Users.findById(reqId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid Use 1' });
        }

        const existFriend = await Friends.findOne({
            $or: [
                { $and: [{ oneId: userId }, { twoId: findUser.id }] },
                { $and: [{ oneId: findUser.id }, { twoId: userId }] }
            ]
        });


        console.log('Exitings Friends ', existFriend);
        if (existFriend) {

            findUser.relations.pull(existFriend);
            await findUser.save();
            findUser.friends.pull(existFriend);
            await findUser.save();
            const friend_del = await Friends.deleteMany({
                $or: [
                    { $and: [{ oneId: userId }, { twoId: findUser.id }] },
                    { $and: [{ oneId: findUser.id }, { twoId: userId }] }
                ]
            });
            console.log('Remove Friend SuccessFully.....', friend_del);
        }
        else {
            console.log('helooo');
            const reqfriend = await Friends.create({
                oneId: userId,
                twoId: findUser.id
            })
            findUser.relations.push(reqfriend);
            await findUser.save();
            const value = {
                first: findone,
                second: findUser
            }
            SendReq(value);
            console.log('Send Friend Req SuccessFully....', reqfriend);
        }


        success = true;
        return res.json({ success, message: 'message:Send Friend Req SuccessFully....' });
    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Send Friend req x x x ' });
    }
})
//remove req

//get data
router.get('/getdata', fetchUser, async (req, res) => {

    let success = false;
    const userId = req.user.id;

    const findUser = await Users.findById(userId);
    if (!findUser) {
        return res.status(400).json({ success, message: 'InValid User 1' });
    }

    const userData = await Users.findById(userId)
        .populate({
            path: 'relations',
            populate: {
                path: 'oneId',
            }
        })
        .populate({
            path: 'relations',
            populate: {
                path: 'twoId',
            }
        })
        .populate({
            path: 'friends',
            populate: {
                path: 'oneId'
            },
        })
        .populate({
            path: 'friends',
            populate: {
                path: 'twoId'
            },
        });

    console.log('Hi Bhavesh Sir B=>        ', userData);

    const relations = []


    for (let val of userData.relations) {
        if (val.oneId._id != userId) {
            relations.push(val.oneId);
        }
        else {
            relations.push(val.twoId);

        }
    }


    const friends = [];
    for (let val of userData.friends) {
        if (val.oneId._id != userId) {
            friends.push(val.oneId);
        }
        else {
            friends.push(val.twoId);

        }
    }



    success = true;
    console.log('Relation=> ', relations)
    console.log("friends=> ", friends);
    return res.json({ success, relations, friends });


})


//add req
router.get('/add/:id', fetchUser, async (req, res) => {

    try {

        let success = false;
        const userId = req.user.id;
        const friendId = req.params.id;
        //console.log("Friend Id=> ",friendId)
        const findFriend = await Users.findById(friendId);

        const relation = await Friends.findOne({
            $or: [
                { $and: [{ oneId: userId }, { twoId: friendId }] },
                { $and: [{ oneId: friendId }, { twoId: userId }] }
            ]
        });

        if (!relation) {
            return res.status(400).json({ success, message: 'InValid User 3' });
        }

        //console.log('Relation Id=> SuccessFully.......',relation);

        const relationsId = relation._id
        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User 1' });
        }

        const friends_relation = await Friends.findById(relationsId);

        if (!friends_relation) {
            return res.status(400).json({ success, message: 'InValid relation 2' });
        }

        findUser.relations.pull(friends_relation);
        await findUser.save();
        findUser.friends.push(friends_relation);
        await findUser.save();
        findFriend.friends.push(friends_relation);
        await findFriend.save();
        success = true;
        return res.json({ success, message: 'add Friend SucessFully....' })

    } catch (err) {
        console.log('Internal Error in Create User x x x ', err);
        return res.json({ success, message: 'Internal Error in Create Send Friend req x x x ' });
    }
})
//del friends


router.get('/delete/:id', fetchUser, async (req, res) => {
    try {
        let success = false;
        const userId = req.user.id;
        const friendId = req.params.id;
        //console.log("Friend Id=> ",friendId)
        const findFriend = await Users.findById(friendId);

        const relation = await Friends.findOne({
            $or: [
                { $and: [{ oneId: userId }, { twoId: friendId }] },
                { $and: [{ oneId: friendId }, { twoId: userId }] }
            ]
        });

        if (!relation) {
            return res.status(400).json({ success, message: 'InValid User 3' });
        }

        //console.log('Relation Id=> SuccessFully.......',relation);

        const relationsId = relation._id;

        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User 1' });
        }

        const friends_relation = await Friends.findById(relationsId);
        if (!friends_relation) {
            return res.status(400).json({ success, message: 'InValid relation 2' });
        }


        findUser.friends.pull(friends_relation);
        await findUser.save();
        const Friend_del = await Friends.deleteOne(friends_relation);
        console.log('Del Friend => ', Friend_del);
     
        findFriend.friends.pull(friends_relation);
        await findFriend.save();
        const findFriend_del = await Friends.deleteOne(friends_relation);

        console.log('Del Friend => ', findFriend_del);
        success = true;
        return res.json({ success, message: 'Del Friend UuccessFUlly......' });


    } catch (err) {
        console.log('Internal Error in Del Friend req ', err);
        return res.json({ success, message: 'Internal Error in Create Send Friend req x x x ' });
    }
})

module.exports = router;