const express =require("express")
const router= express.Router();
const User=require("../../models/User")
const gravatar=require("gravatar")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config=require("config")
const {check, validationResult}=require("express-validator");
// var mongoose = require('mongoose');



//   routes post apis/users 
//descreption  register users
//access public

router.post("/",[
    //here we are checking name and emain and password
    check("name","Name is required").not().isEmpty(),
    check("email","Please include a valid email..").isEmail(),
    check("password","please enter a password with 6 or more charchter" ).isLength({min:6,max:12}),

   
],
async(req,res)=>{
        console.log(req.body)
        const error=validationResult(req);
        //here we are checking the error
        if(!error.isEmpty()){
            return res.status(400).json({error:error.array()}) 
              // this is abad request it will give the json format in arry //
        }
    const {name,email,password}=req.body
    try{

        // if the user is exists//
        let user=await User.findOne({email})
        if(user){
        return  res.status(400).json({error:[{message:"user already existed"}]})
        }
        //user gravatar
        const avatar=gravatar.url(email,{
            s:'200',  //default size
            r:'pg',  //rating
            d:'mm',  //defalut image
        })

        user=new User({
            name,
            email,
            avatar,
            password
        })

        //Encrpt password
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(password,salt)
        await user.save(); 

        // Return jsonwebtoken

        // res.json("User Registed")
        // if(user){
        //     return  res.status(200).json({meassage:[{message:"user register"}]})
        //     }
        const payload={
            user:{
                id:user.id
            }
        };
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn:360000},
            (err,token)=>{
            if(err) throw err;
            res.json({ token });
            
         })
    } catch(err){
    //something went wrong means comes here//
    console.log(err.message)
    res.status(500).send("server error")

    }    
    });

module.exports=router