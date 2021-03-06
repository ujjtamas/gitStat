const { Router } = require("express");
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.models');
const Git = require('../models/Git.models');
const getData = require('../util/getDataFromAPI');

const { isLoggedIn, isLoggedOut } = require('../middlewares/middleware');
const { findOneAndUpdate } = require("../models/User.models");

router.get('/statistics/:gitusername/:gitrepo', (req,res,next) =>{
    let body = req.body;
    const userId = req.session.currentUser._id;
    let gitusername = req.params.gitusername;
    let gitrepo = req.params.gitrepo;
    
    buildData()
    async function buildData(){
        let gitRepoData = await getGitConfig();
        let arr = gitRepoData.linkToStats
        console.log('E:' + gitRepoData);
        let j = 1;
        let obj = {}
        obj.repo = gitrepo;
        for(i in arr){
            // Build the tiles from the data
            let data = await getData(arr[i]);
            if(data == undefined){
                console.log('Cannot fetch data');
            }
            
            if(arr[i].indexOf('code_frequency') > -1){
                obj.code_frequency = data;
            }

             if(arr[i].indexOf('contributors') > -1){
                obj.contributors = data;
            } 

            if(arr[i].indexOf('participation') > -1){
                obj.participation = data;
            } 
        }
        /* let e = {data: obj};
        console.log(e)
        console.log(e.data.participation); */
        res.render('statistics', {data: obj});
    }
    
    //populate charts from data
    async function getGitConfig(){
        let data = await getGitConfigs();
        let gitRepoObj = {};
        for (i in data){
            if(data[i].title == gitrepo){
                gitRepoObj = (data[i]);
                break;
            }
        }
        return(gitRepoObj);
    }

    //fetch relevant configuration data
    async function getGitConfigs(){
        let p = Git.findOne({username:userId})
            .then(user => {
                return user.gitDetails;
            });
            return p;
        }
       // console.log ('object here', test);
    //res.render('statistics', {data: obj});
});

module.exports = router;
