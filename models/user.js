const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const StudentSchema = mongoose.Schema({
    studentname:{
        type:String
    },
    email:{
        type:String,
        required: true
    },
    fathername:{
        type:String,
        required: true
    },
    mothername:{
        type:String,
        required: true
    },
    phnumber:{
        type:Number,
        required: true
    },
    gender:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});

const User = module.exports = mongoose.model('User',StudentSchema);
module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}
module.exports.getUserByStudentname = function(studentname,callback){
    const query = {studentname:studentname};
    console.log(query);
    User.findOne(query,callback);
}    
module.exports.addUser = function(newUser,callback){
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(newUser.password,salt, (err,hash) => {
            if(err) throw (err);
            newUser.password = hash;
            newUser.save(callback);

        });
    });
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch) => {
    if(err) throw err;
    callback(null,isMatch);
    });
}




