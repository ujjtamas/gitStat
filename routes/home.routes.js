const { Router } = require("express");
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.models');
const Git = require('../models/Git.models'); 
const { isLoggedIn, isLoggedOut } = require('../middlewares/middleware');
const { rawListeners } = require("../models/User.models");
const getCode = require('../util/getCode');
const getRepos = require('../util/getLinkToRepos');

//get login page. (should be start page. page home in our nice picture)
router.get('/home', isLoggedIn, (req,res,next) => res.render('home.hbs'));

router.get('/profile', isLoggedIn, (req,res,next) => {
    const gitusernames = req.session.currentUser.gitusernames;

    for (i in gitusernames){
    getRepos(gitusernames[i])
        .then( data => {
            res.render('profile', {data: data});
    });
   }
    // res.render('profile.hbs')
});

router.post('/home',isLoggedIn, (req,res,next) => {
    
    let obj = req.body;
    let userId = req.session.currentUser._id;
    getCode(obj);
    
    for(key in obj){
        // console.log(key + ': ' + key.obj);
        //here we need to update the db based on the key
        //first remove everything so that changes also handled and then add everything again
        //prepare config object
        // console.log(req.session.currentUser.gitusernames + ' ' + key + ' code ' );
        // console.log(key.indexOf('_'));
        

        Git.findOne({username: userId})
            .then(user => {
                if(user){
                    // delete
                }
                if(!user){
                    //create user
                    // Git.create({username:userId,})
                }
            })
    }
});

module.exports = router;