require("dotenv").config()
const express = require("express");
const app = express();
const mongoose = require('mongoose')
 const shortURL =require("./models/shorturlschema");

 // middlewares
app.use((req,res,next)=>{ console.log(req.url,req.method); next() } );
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}));

//get
app.get('/', async (req,res)=>{
   const shortUrls = await shortURL.find()
    res.render("index",{ shortUrls: shortUrls})
})


//post
app.post("/", async (req,res)=>{
   await shortURL.create({ fullurl: req.body.fullUrl})
   res.redirect("/");

})
//get
app.get('/:shortUrl', async (req,res)=>{
    const ShortURL = await shortURL.findOne({ shorturl : req.params.shortUrl })
    if( ShortURL == null) return res.sendStatus(404)
    ShortURL.clicks++
    ShortURL.save()
    res.redirect(ShortURL.fullurl)
 })
 

// connect with moongoose database
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false} , (err)=>{
    if(err) {console.log("DB not connected")}
    console.log("DB connected...")
});

 const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log("server running on 3000...")
})