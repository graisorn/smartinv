//import Express
const express = require('express')
const router = express.Router()
//สร้าง method  ในการทำงานบน Server
router.get('',(req,res)=>{
    //res.send('<h1>Hello  Express</h1>')
    //res.json({name:'Graisorn',email:'graisorn@gmail.com'})
    res.render('pages/frontend/index',{title: 'Home'})
 })

 router.get('/about',(req,res)=>{
    //res.send('<h1>Hello  Express</h1>')
    //res.json({name:'Graisorn',email:'graisorn@gmail.com'})
    res.render('pages/frontend/about',{title: 'About'})
 })
 router.get('/login',(req,res)=>{
   res.render('pages/frontend/login',
      {
      title: 'Login',
      layout:'./layouts/authen'
      }
   )
 })
 router.get('/register',(req,res)=>{
   res.render('pages/frontend/register',
      {
      title: 'Register',
      layout:'./layouts/authen'
      }
   )
 })

 module.exports = router