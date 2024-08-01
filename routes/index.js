const express = require('express');
const router = express.Router();

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');

const userModel = require('../models/user-model');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public');
    },
    filename: function (req, file, cb) {
      const filename = `/images/${Date.now()}-${file.originalname}`;
      cb(null,filename);
    }
});

const upload = multer({ storage: storage });

router.get('/', function (req, res) {
    res.redirect('/login');
});

router.get('/login',isNotLoggedIn, function (req, res) {
    res.render('login');
});

router.get('/signup',isNotLoggedIn, function (req, res) {
    res.render('signup');
});

router.get('/profile/:id',isLoggedIn ,async function (req, res) {
    let user = await userModel.findOne({_id:req.params.id});
    res.render('profile',{user});    
});

router.post('/signup',async function (req, res) {
    const { username, email, password} = req.body;
    let userAlready = await userModel.findOne({email});
    if(userAlready) {
       res.send('user already exists.');
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            const user = await userModel.create({ username, email, password:hash});
            let token = jwt.sign({email,username:user.username,_id:user._id,profileImage:user.profileImage},'shhhhh');
            res.cookie('token', token);
            res.redirect(`/profile/${user._id}`);
        });
    });
});

router.post('/login',async function(req, res) {
    try {
        const {email, password} = req.body;
        let user = await userModel.findOne({email});
        if(!user) {
            throw new Error("Invalid email or password")
        }
    
        const matchPassword = await bcrypt.compare(password, user.password);
        
        if (!matchPassword) throw new Error("Invalid email or password")
        
        let token = jwt.sign({email,username:user.username,_id:user._id,profileImage:user.profileImage},'shhhhh');
        res.cookie('token', token);
        res.redirect(`/profile/${user._id}`);
    } catch (error) {
        res.render('login',{error})
    }
});

router.post('/logout', function(req, res) {
    res.clearCookie('token');
    res.redirect('/');
});

router.get('/delete',async (req,res)=> {
    await userModel.deleteMany();
    res.redirect('/login');
});

router.post('/profile/:id', upload.single('profileImage'), async (req, res) => {
    let user = await userModel.findOne({_id:req.params.id});
    await userModel.findOneAndUpdate({_id:req.params.id}, {profileImage:req.file.filename},{new:true});
    res.redirect(`/profile/${req.params.id}`);
});

router.get('/chatToStrangers',isLoggedIn,async (req, res) => {
    let users = await userModel.find();
    let currentUser = await userModel.findOne({email:req.user.email});
    res.render('chatToStrangers',{users,currentUser});
});

router.get('/chat/:id',isLoggedIn,async (req, res) => {
    let user = await userModel.findOne({_id:req.params.id});
    res.render('chat',{user});
});


module.exports = router;