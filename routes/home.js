const express = require('express');
const Posts = require('../models/posts');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Users = require('../models/users');

//get all data
//login

router.get('/home', fetchUser, async (req, res) => {

      try {
            let success = false;
            const userId = req.user.id;
            console.log(userId);

            const findUser = await Users.findById(userId);
            if (!findUser) {
                  return res.status(400).json({ success, message: 'InValid User' });
            }
            const Alluser = await Users.find({});

            for (let val of Alluser) {
                  const cfhandle = val.cfname;
                  console.log(cfhandle);
                  const apiUrl = 'https://codeforces.com/api/user.info?handles=' + cfhandle;

                  if (cfhandle) {
                        try {

                              fetch(apiUrl)
                                    .then(response => response.json())
                                    .then(data => {
                                          // do something with the data
                                          console.log(data);
                                          if (data.status == 'OK') {
                                                console.log("ok ==>",data.result[0].handle);
                                                Users.findOne({ cfname: data.result[0].handle }).then((findUser) => {

                                                      console.log('hach wrong aahe=>>>>>>, ttt',findUser);
                                                      Users.findByIdAndUpdate(findUser.id, {
                                                            cfData: data.result[0],
                                                            maxRating:data.result[0].maxRating,
                                                            maxRank:data.result[0].maxRank
                                                      }).then((updateUser) => {
                                                            console.log('UpdateUser cfData SuccessFully.....', updateUser)
                                                      }, (err) => {
                                                            console.log('Error Updat xxxxxx=> ', err);
                                                      })
                                                }, (err) => {
                                                      console.log('Error xxxxxx=> ', err);
                                                })
                                          }
                                          else {

                                          }
                                          //      Users.find({ cfname: data.result[0].handle }, (err, value_data) => {
                                          //           if (err) {
                                          //                console.log('Error in Find Handle Data: ', err);
                                          //           }
                                          //           console.log('HI Bhavesh Sir Value Data: ');
                                          //           console.log(value_data);
                                          //           Users.findByIdAndUpdate(value_data[0].id, {
                                          //                cfData: data.result[0],

                                          //           }, (err, finalData) => {

                                          //                if (err) {
                                          //                     console.log('Error in Update Data: ', err);
                                          //                }
                                          //                console.log("Firnal Updated Data: ", finalData);
                                          //           });

                                          //     });


                                    })
                                    .catch(error => {
                                          console.error('Error:', error);
                                    });

                        }
                        catch (err) {
                              console.log('Error in fetch cf api x x x', err);
                        }
                  }

            }
            const posts = await Posts.find({})
                  .sort({ createdAt: -1 })
                  .populate('user')
                  .populate({
                        path: 'comments',
                        populate: {
                              path: 'user'
                        }
                  })
                  .populate({
                        path: 'likes',
                        populate: {
                              path: 'user'
                        }
                  })
                  .populate({
                        path: 'comments',

                        populate: {
                              path: 'likes',
                              populate: {
                                    path: 'user'
                              }
                        }
                  });




            ////////////////////////////////////////////////////
            success = true;
            console.log('Get All Data SuccessFull................');
            return res.json({ success, posts, Alluser })
      } catch (err) {
            console.log('Internal Error in get Home User x x x ', err);
            return res.json({ success, message: 'Internal Error in get Home Post x x x ' });
      }

})

module.exports = router;