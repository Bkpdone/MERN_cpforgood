const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const fetchUser = require('../middleware/fetchUser');
const JWT_Shash = 'Bh@veshPharateisgoodboyhelovebalaji'
const path=require('path');
const fs=require('fs');


//Route=> 1
//create-user
//no login
router.post('/create-user', [body('name').exists(), body('email').isEmail(), body('password').isLength({ min: 1 })],
    async (req, res) => {
        let success = false;
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), success });
            }

            const { name, email, phone ,password,about,cfname} = req.body;
            console.log("name,email,password,cfname,about,phone",name, email, password, cfname, about, phone );
            //Bhavesh pharatebhavesh@gmail.com 8421523685 1 DSA Bhaveshpharate 
            const findUser = await Users.findOne({ email });
            if (findUser) {
                return res.status(400).json({ success, message: 'User is Exist change Email Id' });
            }

            //get salt promise
            const salt = await bcrypt.genSalt(10);
            const SecurePassword = await bcrypt.hash(password, salt);


            const user = await Users.create({
                name: name, email: email, password: SecurePassword, cfname: cfname, about: about,phone:phone
            });
            //console.log('user is created SuccessFully.... \n', user);
            console.log('user is created SuccessFully.... ');

            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_Shash)
            success = true;

            res.json({ success, authtoken });
        }
        catch (err) {
            console.log('Internal Error in Create User x x x ', err);
            return res.json({ success, message: 'Internal Error in Create User x x x ' });
        }
    })


//Route=>2
//login
//no log in
router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 1 })],
    async (req, res) => {
        let success = false;
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), success });
            }

            const { email, password } = req.body;
            console.log(email, password);
            const findUser = await Users.findOne({ email });
            if (!findUser) {
                return res.status(400).json({ success, message: 'InValid User' });
            }

            //get salt promise
            const confirmPassword = await bcrypt.compare(password, findUser.password);

            if (!confirmPassword) {
                return res.status(400).json({ success, message: 'InValid User' });
            }

            console.log('Login user SuccessFully.... \n', findUser)

            const data = {
                user: {
                    id: findUser.id
                }
            }

            const authtoken = jwt.sign(data, JWT_Shash)
            success = true;

            res.json({ success, authtoken });
        } catch (err) {
            console.log('Internal Error in Create User x x x ', err);
            return res.json({ success, message: 'Internal Error in Create User x x x ' });
        }
    })


router.post('/avatar',fetchUser,async(req,res)=>{

  
  
    let success = false;
    const userId = req.user.id;
    console.log(userId);
    const {avatar } = req.body;
    const findUser = await Users.findById(userId);
    if (!findUser) {
        return res.status(400).json({ success, message: 'InValid User' });
    }
    

   // if some photo present delet first then update
    const filename=findUser.avatar;
    if(filename){

        const filePath=path.join(__dirname,'..',`/uploads/avatar/${filename}`)
        ////////////////////////////
        fs.unlink(filePath, function(err) {
            if (err) {
              console.error('Error deleting the image file:', err);
              return;
            }
          
            console.log('Image file deleted successfully');
          
          
          });
    
    }


      //update image
    Users.UpdatePhoto(req, res, function () {

        if (req.file) {
            findUser.avatar = req.file.filename;
        }
        findUser.save();

        console.log('Profile pic updated SuccessFully.............................................', findUser);
        success = true
        return res.json({ success,findUser });
        //  console.log('Hi Bhavesh Photo Update SuccessFully....................',post);
    })
})

module.exports = router;