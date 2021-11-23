//import path
const path = require('path')
//import Express
const express = require('express')
// import express flash
const flash = require('express-flash')
//import session
const session = require('express-session')

//import ejs layout
const expressLayouts = require('express-ejs-layouts')
//import file frontend.js
const frontendRouter = require('./routes/frontend')
//import backend
const backendRouter = require('./routes/backend')



//create express object
const app = express()
//กำหนด Pathให้ express รุ้ว่า images CSS อยู่ ยฟะ้ ไหร
//app.use(express.static('assets'))
app.use(express.static(path.join(__dirname,'assets')))

//กำหนด Template Egine
app.use(expressLayouts)
app.set('layout','./layouts/frontend')
app.set('view engine','ejs')
//
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//เรียกใช้ session
app.use(session({
    cookie:{maxAge: 6000},
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret:'secert'
}))
//เรียกใช้ flash
app.use(flash())
//เรียกใช้ Route
app.use('/',frontendRouter)
app.use('/backend',backendRouter)

//run express server
app.listen(5000,()=>{
    console.log("Web Server run at port 5000")
})


