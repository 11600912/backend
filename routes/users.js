const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config =require('../config/database');

const User = require('../models/user');

//REGISTER
router.post('/register', (req,res,next) => {
    console.log(req.body);
    let newUser =new User({
        studentname:req.body.studentname,
        fathername:req.body.fathername,
        email:req.body.email,
        mothername:req.body.mothername,
        gender:req.body.gender,
        qualifications : req.body.qualifications ? req.body.qualifications : null,
        phnumber:req.body.phnumber,
        password:req.body.password
    });
    User.addUser(newUser,(err,user) => {
        if(err){
            res.json({success:false,msg:'falied to register user - ' + err});
        }else{
        res.json({success:true,msg:'user registered'});
    }
    }); 
});
//authenticate
router.post('/authenticate', (req,res,next) => {
    const studentname = req.body.studentname;
    const password = req.body.password;
    console.log(req.body)
    User.getUserByStudentname(studentname, (err,user) => {
        if(err) throw err;
            if(!user){
                return res.json({success:false,msg:'user not found'});
            }
            User.comparePassword(password,user.password, (err,isMatch) => {
                if(err) throw err;
                if(isMatch){
                    console.log(">>>>>",user);
                    let user1 = {
                        "username":user.email,
                        "_id":user._id
                };
                    const token = jwt.sign(user1,
                                    config.secret,
                                    {expiresIn:60*60});
                    //response to front end
                    res.json({
                        success:true,
                        token:'JWT '+token,
                        user: {
                            id:user._id,
                            studentname:user.studentname,
                            fathername:user.fathername,
                            email:user.email,
                            mothername:user.mothername,
                            gender:user.gender,
                            phnumber:user.phnumber,
                            password:user.password
                        }
                      });
                    } else {
                      return res.json({success:false,msg:'Wrong Password'});
            } 
        });
    }); 
});
router.get('/profile',passport.authenticate('jwt', {session:false}), (req,res,next) => {
    res.json({user:req.user});
});
router.post('/validate', (req,res,next) => {
    res.send('VALIDATE');
});
module.exports = router;