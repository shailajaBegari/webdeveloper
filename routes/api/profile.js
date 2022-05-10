const express =require("express")
const router= express.Router();
const auth=require("../../middleware/auth")
const {check,validationResult}=require("express-validator")
const Profile=require("../../models/Profile")
const User=require("../../models/User");
const Post = require('../../models/Post');
const request=require("request")
const config=require("config");
const { response } = require("express");

// var mongoose = require('mongoose');





// Get apis/profile/me
//descreption  Get current user profile
//access private

router.get("/me",auth,async(req,res)=>{
    try{
    const profile= await  Profile.findOne({user:req.user.id}
        ).populate("user",["name","avatar"]);
    if(!profile){
        return res.status(400).json({message:"There is no profile for user"})
    }    
    //  res.status(200).json({message:profile})
    res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send("SERVER ERROR");
    // const profile= await  Profile.findOne({user:req.user})    
}

});

// Post apis/profile
//create or update user profile
//access private

router.post("/",[auth,[
    check("status","status is reqiured").not().isEmpty(),
    check("skills","skills is required").not().isEmpty(),
]

],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;

    //BUID PROFILE OBJECT
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        // console.log(123);
        profileFields.skills=skills.split(",").map(skill=>skill.trim());

    }
    //BULID SOCIAL OBJECTS
    profileFields.social={}
        if(youtube) profileFields.social.youtube=youtube;
        if(twitter) profileFields.social.twitter=twitter;
        if(facebook) profileFields.social.facebook=facebook;
        if(linkedin) profileFields.social.linkedin=linkedin;
        if(instagram) profileFields.social.instagram=instagram;

    // console.log(profileFields.social.twitter);
    // res.send("Hello..")
    let profile= await Profile.findOne({user:req.user.id})
    try{

        // let profile= await Profile.findOne({user:req.user.id})
        
        if(profile){
            //we can update
            profile= await  Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
                );
        return  res.json(profile)
        }
        //create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)

    }catch(err){
        console.log(profile);
        console.error(err.message);
        res.status(500).send("Server Error");

    }
});

// GET apis/profile
//GET ALL PROFILE
//access PUBLIC

router.get("/",async(req,res)=>{
    try{
    //    const profiles=await Profile.find().populate("user",["name","avatar"]);
    //    res.json(profiles)
    const profiles = await Profile.find().populate("user",["name","avatar"]);
    res.json(profiles)

    }catch(err){
        console.error(err.message)
        res.status(500).send("Server -Error");
    }
})



// GET apis/profile/user/:user_id
//GET ALL PROFILE by user id
//access PUBLIC 

router.get("/user/:user_id",async(req,res)=>{
    try{
       const profile=await Profile.findOne({
           user:req.params.user_id}).populate("user",["name","avatar"]);

       if(!profile) 
       return res.status(400).json({msg:"There is no profile for this user"});

       res.json(profile)

    }catch(err){
        console.error(err.message)
        // its is valid user id 
        if(err.kind=="ObjectId"){
            return res.status(400).json({msg:"There is no profile for this user"});

        }
        // res.status(500).send("Server--Error");

    }
})
 
// DELETE apis/profile
//DELETE  proffile,user and posts
//access Private

router.delete("/",auth,async(req,res)=>{
    try{
        // todo -remove users posts
        await Post.deleteMany({user:req.user.id})

        //Remove profile
     await Profile.findOneAndRemove({ user:req.user.id });
     //Remove user
     await User.findOneAndRemove({_id:req.user.id });

    res.json({msg:"User removed"})

    }catch(err){
        console.error(err.message)
        res.status(500).send("Server -Error");
    }
})


// PUT apis/profile/Experience
//add profile experience
//access Private

router.put("/experience",[auth,[
    check("title","Title is required")
    .not()
    .isEmpty(),
    check("company","Company is required")
    .not()
    .isEmpty(),
    check("from","From is required")
    .not()
    .isEmpty(),
    
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()});
    }
    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;
    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try{
        const profile=await Profile.findOne({ user : req.user.id});

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile)


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server----Error")
    }

})


// DELETE apis/profile/Experience/:exp_id
//Delete  profile experience from profile
//access Private

router.delete("/experience/:exp_id",auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user : req.user.id});
        //Get remove index
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1)        

        await profile.save();

        res.json(profile)



    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})



// PUT apis/profile/Education
//add profile Education
//access Private

router.put("/education",[auth,[
    check("school","School is required")
    .not()
    .isEmpty(),
    check("degree","Degree is required")
    .not()
    .isEmpty(),
    check("fieldofstudy","Field of study is required")
    .not()
    .isEmpty(),
    check("from","From is required")
    .not()
    .isEmpty(),
    
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()});
    }
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body;
    const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try{
        const profile=await Profile.findOne({ user : req.user.id});

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile)


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server----Error")
    }

})


// DELETE apis/profile/Education/:edu_id
//Delete  profile education from profile
//access Privvate

router.delete("/education/:edu_id",auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user : req.user.id});
        //Get remove index
        const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex,1)        

        await profile.save();

        res.json(profile)



    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


// GET apis/profile/GITHUB/:USERNAME
//GET USER REPOS FROM  GITHUB
//access PUBLIC

router.get("/github/:username",(req,res)=>{
    try{
        const options={
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecrete")} ` ,
            method:"GET",
            headers:{"user-agent":"node.js"}
        }
        request(options,(error,response,body)=>{
            if(error) console.error(error);

            if(response.statusCode!==200){
                res.status(404).json({msg:"No Github Profile Found."})
            }
            // console.log(req.body)
            res.json(JSON.parse(body));

        })

    }catch(err){
        console.error(err.message)
        res.status(500).send("Server-Error")
    }
})



module.exports=router;





























