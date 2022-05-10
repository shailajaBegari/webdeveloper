const express =require("express")
const router= express.Router();
const auth = require("../../middleware/auth")
const {check,validationResult}=require("express-validator/check");
const User = require("../../models/User");
const Post=require("../../models/Post")
const Profile=require("../../models/Profile")
// var mongoose = require('mongoose');

//  POST api/posts
//descreption  create a post
//access private

router.post("/",
    [auth,[
        check("text","Text is required")
        .not()
        .isEmpty()

    ]],async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        try{
            const user=await User.findById(req.user.id).select("-password");
            
            const newPost= new Post({
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            } )
            const post=await newPost.save();
            console.log(post)

            res.json(post)

        }catch(err){
            console.error(err.message)
            res.status(500).send("server-error")

        }


    })

// @route GET api/posts
// @desc Get all posts
// @access Public

router.get("/",auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({date:-1})
        res.json(posts)

        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server-error")
        
    }
})

    
// @route GET api/posts/:id
// @desc Get all postsby ID
// @access Private

router.get("/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        res.json(post)

        
    } catch (error) {
        console.error(error.message624d9841cc9ed906ec80b327)
        if(err.kind==="ObjectId"){
            return res.status(404).json({message:"Post not found"})
        }
        res.status(500).send("server-error")
        
    }
})



// @route Delete api/posts
// @desc Delete all posts
// @access Public

router.delete("/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        //check user
        if(post.user.toString()!==req.user.id){
            return res.status(401).json({ms:"User not authorized"})
        }
        await post.remove();
        
        res.json({msg:"Post Removed"})
    } catch (error) {
        console.error(error.message)
        if(err.kind==="ObjectId"){
            return res.status(404).json({message:"Post not found"})
        }
        res.status(500).send("server-error")
        
    }
})


// @route   PUT api/posts/LIKE/:ID
// @desc LIKE A POST
// @access PRIVATE

router.put("/like/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        // check if the post has already been linked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:"Post already liked."});
        }
        post.likes.unshift({user:req.user.id})

        await post.save();
        res.json(post.likes);
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server-error")
        
    }
})



// @route   PUT api/posts/UNLIKE/:ID
// @desc UNLIKE A POST
// @access PRIVATE

router.put("/unlike/:id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        // check if the post has already been linked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
            return res.status(400).json({msg:"Post  has not yyet been liked"});
        }
       //Get Removes index
       const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id)

       post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server-error")
        
    }
})


//  POST api/posts/comment/:id
//descreption  comment on a post
//access private

router.post("/comment/:id",
    [auth,[
        check("text","Text is required")
        .not()
        .isEmpty()

    ]],async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        try{
            const user=await User.findById(req.user.id).select("-password");
 
            const post=await Post.findById(req.params.id);
            
            const newComment={
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            } 
            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments)

        }catch(err){
            console.error(err.message)
            res.status(500).send("server-error")

        }


    })



//  DELTEapi/posts/comment/:id
//descreption DELTE  on a post
//access private

router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        //pull post comment
        const comment=post.comments.find(comment=>comment.id===req.params.comment_id);

        //Make sure comment is exists or not?
        if(!comment){
            return res.status(404).json({msg:"COMMENT DOES NOT EXIST"})
        }
        
        //CHECK USER
        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({msg:"USER NOT AUTHORIZED."})
        }
        //GET REMOVE INDEX
        const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex,1);
 
         await post.save();
 
         res.json(post.comments);
        




    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server-Error.")
    }


});


module.exports=router;