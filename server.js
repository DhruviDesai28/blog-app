const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require("dotenv").config()
const Ur = require('./models/user');
const Bg = require('./models/blog');
const Pt = require('./models/post');
const user = require('./models/user');
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true, useUnifiedTopology : true ,
    useCreateIndex : true, useFindAndModify : false
})

const app = express()

app.use(cors());
app.use(express.json());
app.get("/",(req,res) => {
    
})
// Route : Sign Up
app.post('/signup', async (req,res)=>{
    const {email,username,password} = req.body;
    const emailRegex = /\w{5,}@\w{4,}\.\w{2,}+/ // heetkv= \w @ \w - 
    const passwordRegex = /\w{8,50}/ 
    if(emailRegex.test(email) && passwordRegex.test(password)){

    Ur.insertMany({
        username,
        email,
        password
    },(data,err)=>{
        if(err){res.status(500).json(err)}
        else{res.status(201).json(data)}
    })
}
else{
    res.status(500).json({msg:"Invalid email or password"})
}
})

// Route : Login
app.post('/login',async (req,res)=>{
    const {username,password} = req.body;
         Ur.find({username,password},{__v:0,password:0,},(data,err)=>{
            if(err){ res.status(404).json(err)}
            else{res.json(data).status(200)}
        })
})

//get post
app.get('/post', (req,res)=>{
    const {id} = req.params;
    Pt.find({userid:id},{__v:0},(data,err) => {
        if(err){ res.status(500).json(err)}
        else{res.status(200).json(data)}
    })
})

app.post('/post',(req,res)=>{
    const {caption, userid, imageurl} = req.body
    const captionRegex = /\w{0,70}/ 
    const imageurlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/
    if (captionRegex.test(caption)&& imageurlRegex.test(imageurl)){
    Pt.insertMany({
        caption,
        userid,
        imageurl, 
        date : Date()
    },(data,err)=>{
        if(err){res.status(500).json(err)}
       else{ res.status(201).json(data)}
    })
    }
    else{
        res.status(500).json({message :"Invalid caption or imageurl"})
    }
})

app.delete('/post',(req,res)=>{
    const {_id} = req.body;
    Pt.findByIdAndDelete(_id).exec((data,err)=>{
        if(err){ res.status(500).json({err})}
        else{res.status(200).json({msg:data})}
    })
})

app.put('/post', (req,res)=>{
    const {_id , name,value} = req.body;
    Pt.findByIdAndUpdate(_id,{[name]:value},{new:true}).exec((data,err)=>{
        if(err){ res.status(500).json({err})}
        else{res.status(200).json({msg:data})}
    })
})

// blog bhai aayo

app.get('/blog', (req,res)=>{
    const {_id} = req.params;
    Bg.find({userid:_id},{__v:0},(data,err) => {
        if(err){ res.status(500).json(err)}
        else{res.status(200).json(data)}
    })
})

app.post('/blog',(req,res)=>{
    const {title, userid, body} = req.body
    const titleRegex = /.{5,}/ 
    const bodyRegex = /(.\n?){50,}/
    if (titleRegex.test(title)&& bodyRegex.test(body)){
    Bg.insertMany({
        title,
        userid,
        body, 
        date : Date() 
    },(data,err)=>{
        if(err){res.status(500).json(err)}
       else{ res.status(201).json(data)}
    })
    }
    else{
        res.status(500).json({message :"Invalid title or body"})
    }
})

app.delete('/blog',(req,res)=>{
    const {_id} = req.body;
    Bg.findByIdAndDelete(_id).exec((data,err)=>{
        if(err){ res.status(500).json({err})}
        else{res.status(200).json({msg:data})}
    })
})

app.put('/blog', (req,res)=>{
    const {_id , name , value} = req.body;
    Bg.findByIdAndUpdate(_id,{[name]:value},{new:true}).exec((data,err)=>{
        if(err){ res.status(500).json({msg:err})}
        else{res.status(200).json({msg:data})}
    })
})

//badha na nu get
app.post('/all',async (req,res)=>{
    const {id} = req.body;
    let user = {}
   const userData = await Ur.findById({_id:id},{__v:0,password:0,});
   const blogs = await Bg.find({userid:id});
   const posts =await  Pt.find({userid:id},{__v:0});
    res.json({
        ...userData._doc,
        blogs,
        posts
    }).status(200)
})

app.listen(3000, () =>console.log("server started"))