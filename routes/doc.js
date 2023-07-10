const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();
const Users= require('../models/users')
const fs=require('fs');
const multer = require('multer');
const path = require('path');
const Photos_Path = path.join('/uploads/doc');

// Set up the storage engine and destination for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        cb(null, path.join(__dirname,"..", Photos_Path));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

// Create the multer middleware and specify the file filter
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.includes('image/') ||
            file.mimetype.includes('video/') ||
            file.mimetype === 'application/pdf'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only images, videos, and PDF files are allowed'));
        }
    }
});



router.post('/doc', fetchUser, upload.single('file'), async (req, res) => {


    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
    
        let success = false;
        const userId = req.user.id;
        console.log(userId);
        const findUser = await Users.findById(userId);
        if (!findUser) {
            return res.status(400).json({ success, message: 'InValid User' });
        }
    
        const obj =
        {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            path: req.file.filename,
        }
    
    
        findUser.doc.push(obj);
        await findUser.save();
    
    
        console.log('Very good bhavesh Sir Uploaded Data SuccessFully............................');
        success=true;
        return res.json({success,findUser});
    } catch (err) {
        console.log('INnter nal Filed Loaded Error xxxxxxxxxxxx xxxxxx ',err);
    }

})

router.post('/delete/:id',fetchUser,async(req,res)=>{

    let success = false;
    const userId = req.user.id;
    const {val } = req.body
 
    const findUser = await Users.findById(userId);
    if (!findUser) {
        return res.status(400).json({ success, message: 'InValid User' });
    }
    console.log('RRRRRRRRRRRRRRRRRRRRRRRRRR=> ',val)
    
    findUser.doc.pull(val);
    await findUser.save();

   // if some photo present delet first then update
    const filename=val.path;
    if(filename){

        const filePath=path.join(__dirname,'..',`/uploads/doc/${filename}`)
        ////////////////////////////
        fs.unlink(filePath, function(err) {
            if (err) {
              console.error('Error deleting the image file:', err);
              return;
            }
            success=true;
            console.log('Image file deleted successfully');
             return res.json({success,message:'delete File SuccessFully'})
          
          });
    
    }

})

module.exports = router;