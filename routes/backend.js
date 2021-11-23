//import Express
const { response } = require('express')
const express = require('express')
//immport mssql
const mssql = require('mssql')
//import for pdf
const ejs = require('ejs')
const pdf = require('html-pdf')
const path = require('path')
const fs = require('fs')
//import Export CSV Writer
const createCsvWriter = require('csv-writer').createObjectCsvWriter
//import moment for formating date/time
const moment =require('moment')

// impoert mysql db connifg
const dbConnMySql = require('../config/mysql_dbconfig')

//import  mssql_db_config
const dbConnMsSql = require('../config/mssql_dbconfig')
// create function connect dbmssql
mssql.connect(dbConnMsSql,(err)=> {
    if(err){
        console.log("Error: "+ err)
    }else{
        console.log("MSSQL Connect DB Success...")
    }
})



const router = express.Router()

// สร้างฟังก์ชันแปลงยอดเงินให้เป็นรูปแบบสกุลเงิน (10,000.50)
const formatPrice = (value)=>{
           let val = (value/1).toFixed(2).replace(',', ',')
           return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
       }
//กำหนดตัวแปรหมวดหมู่สินค้า
const category = ["","Mobile","Tablet","Smart Watch","Laptop"]
//สร้าง method  ในการทำงานบน Server
router.get('',(req,res)=>{
    res.render('pages/backend/dashboard',
        {
            title: 'Dashboard',
            heading: 'Dashboard',
            layout: './layouts/backend'

        }
    )
 })
//MYSQL
 router.get('/mysqlproducts',(req,res)=>{
    let sql ="SELECT * FROM PRODUCTS"
    dbConnMySql.query(sql,(err,rows)=>{
        if(err){
            res.send(err)
        }else{
            //res.json(rows)
            res.render('pages/backend/mysqlproducts',
            {
                title: 'MySQL Products',
                heading: 'MySql Products',
                layout: './layouts/backend',
                data : rows,
                moment : moment,
                formatPrice:formatPrice
            }
    )
            
        }
    })
 })
//MSSQL
 router.get('/mssqlproducts',(req,res)=>{
    let sql ="SELECT * FROM PRODUCTS /*WHERE CategoryID=1*/"
    let request = new  mssql.Request()
    request.query(sql,(err,rows)=>{
        if(err){
            res.send(err)
            throw err
        }else{
            //res.json(rows.recordset)
            res.render('pages/backend/mssqlproducts',
            {
                title: 'MSSQL Products',
                heading: 'MSSQL Products',
                layout: './layouts/backend',
                data : rows.recordset,
                moment : moment,
                formatPrice:formatPrice,
                category:category
            }
            )
        }
    })
 })

 //Create mssql_create_products
router.get('/mssql_create_product',(req,res)=>{
    res.render('pages/backend/mssql_create_product',
        {
            title: 'MSSQL Create Products',
            heading: 'MSSQL',
            layout: './layouts/backend'

        }
    )
 })
//post create product
 router.post('/mssql_create_product',(req,res)=>{
    //รับค่าจาก form
    let ProductName     = req.body.ProductName
    let CategoryID      = req.body.CategoryID
    let UnitPrice       = req.body.UnitPrice
    let UnitInStock     = req.body.UnitInStock
    let ProductPicture  = req.body.ProductPicture
    let curdatetime     =moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors    = false //เก็บสถานะ ว่าป้อนมาครับไหม
    //res.send(ProductName+"<br>"+CategoryID+"<br>"+UnitPrice+"<br>"+UnitInStock+"<br>"+ProductPicture+"<br>"+curdatetime)
    //ตรวจสอบ ว่าป้อนเข้ามา ครบ
    if(ProductName.length=== 0 || UnitPrice ==='' || UnitInStock===''){
        errors = true
        //disp msg error warnnig 
        req.flash('error','ป้อนข้อมูล ไม่สมบูรณ์')
        //reload form 
        res.render('pages/backend/mssql_create_product',
        {
            title: 'MSSQL Create Products',
            heading: 'MSSQL',
            layout: './layouts/backend'

        })
    }
    if(!errors){
        let request = new mssql.Request()
        let sql =`INSERT INTO products (
            CategoryID,
            ProductName,
            UnitPrice,
            ProductPicture,
            UnitInStock,
            CreatedDate,
            ModifiedDate) 
            VALUES (
                '${CategoryID}',
                '${ProductName}',
                '${UnitPrice}',
                '${ProductPicture}',
                '${UnitInStock}',
                '${curdatetime}',
                '${curdatetime}'
            )`
        request.query(sql,(err,result)=>{
            if(err){
                req.flash('error',err)
            }else{
                req.flash('success','เพิ่มรายการเรียบร้อยแล้ว')
                res.render('pages/backend/mssql_create_product',
                    {   
                        title: 'MSSQL Create Products',
                        heading: 'MSSQL',
                        layout: './layouts/backend'
                    })
            }
        })
    }

 })

  //Eit mssql_create_products
router.get('/mssql_edit_product/(:id)',(req,res)=>{
    let id = req.params.id
    let sql ="SELECT * FROM PRODUCTS WHERE ProductID="+ id
    let request = new  mssql.Request()
    request.query(sql,(err,rows)=>{
        if(err){
            res.send(err)
            throw err
        }else{
            //res.json(rows.recordset)
            res.render('pages/backend/mssql_edit_product',
            {
                title: 'MSSQL Edit Products',
                heading: 'MSSQL Edit Products',
                layout: './layouts/backend',
                data : rows.recordset,
                category:category
            }
            )
        }
    })

    
 })
 //Create mssql_create_products
 router.get('/mssql_create_product',(req,res)=>{
    res.render('pages/backend/mssql_create_product',
        {
            title: 'MSSQL Create Products',
            heading: 'MSSQL',
            layout: './layouts/backend'

        }
    )
 })
//post edit product
 router.post('/mssql_edit_product/:id',(req,res)=>{
    //รับค่าจาก form
    let id=req.params.id
    let ProductName     = req.body.ProductName
    let CategoryID      = req.body.CategoryID
    let UnitPrice       = req.body.UnitPrice
    let UnitInStock     = req.body.UnitInStock
    let ProductPicture  = req.body.ProductPicture
    let curdatetime     =moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors    = false //เก็บสถานะ ว่าป้อนมาครับไหม
    //res.send(ProductName+"<br>"+CategoryID+"<br>"+UnitPrice+"<br>"+UnitInStock+"<br>"+ProductPicture+"<br>"+curdatetime)
    //ตรวจสอบ ว่าป้อนเข้ามา ครบ
    if(ProductName.length=== 0 || UnitPrice ==='' || UnitInStock===''){
        errors = true
        //disp msg error warnnig 
        req.flash('error','ป้อนข้อมูล ไม่สมบูรณ์')
        //reload form 
        res.render('pages/backend/mssql_create_product',
        {
            title: 'MSSQL Create Products',
            heading: 'MSSQL',
            layout: './layouts/backend'

        })
    }
    if(!errors){
        let request = new mssql.Request()
        let sql =`UPDATE products SET
            CategoryID='${CategoryID}',
            ProductName='${ProductName}',
            UnitPrice='${UnitPrice}',
            ProductPicture='${ProductPicture}',
            UnitInStock='${UnitInStock}',
            ModifiedDate='${curdatetime}' 
            WHERE  ProductID='${id}'`
        request.query(sql,(err,result)=>{
            if(err){
                req.flash('error',err)
            }else{
                // req.flash('success','แก้ไขรายการเรียบร้อยแล้ว')
                // res.render('pages/backend/mssql_edit_product/${id}',
                //     {   
                //         title: 'MSSQL EDIT Products',
                //         heading: 'MSSQL EDIT Products',
                //         layout: './layouts/backend'
                //     })

                res.redirect('/backend/mssqlproducts')
            }
        })
    }

 })

 // DELETE MSSQL Product
router.get('/mssql_delete_product/:id',(req, res)=>{
    let id = req.params.id
    let sql = `DELETE products WHERE ProductID=${id}`
    let request = new mssql.Request()

    request.query(sql, (err, rows)=>{
        if(err){
            res.send(err)
            throw err
        }else{
            res.redirect('/backend/mssqlproducts')
        }
    })
})


 // export csv MSSQL Product
 router.get('/mssql_exportcsv_product',(req, res)=>{
    //let id = req.params.id
    let filecsvname = "./exportcsv/Products"+ moment(new Date()).format("YYYY-MM-DD-ss") +".csv"
    let sql = `SELECT ProductId,CategoryID,ProductName,UnitPrice,UnitInStock FROM products order by ProductId`
    let request = new mssql.Request()
    request.query(sql, (err, rows)=>{
        if(err){
            res.send(err)
            throw err
        }else{
            //res.json(rows.recordset)
            const toShiftTH =text=>iconv.encode(text,"UTF8")
            const csvWriter = createCsvWriter({
                path: filecsvname,
                header: [
                  { id: "ProductID", title: "ProductID" },
                  { id: "CategoryID", title: "CategoryID" },
                  { id: "ProductName", title: "ProductName" },
                  { id: "UnitPrice", title: "UnitPrice" },
                  { id: "UnitInStock", title: "UnitInStock" }
                ] 
              });
          
              csvWriter
                .writeRecords(rows.recordset)
                .then(() =>
                  //console.log("Write to bezkoder_mysql_csvWriter.csv successfully!")
                  res.download(filecsvname)
                )
        }
    })
})

// export PDF MSSQL Product
// Export PDF MSSQL Product
router.get('/mssql_exportpdf_product',(req, res)=>{

    let sql = 'SELECT ProductID,CategoryID,ProductName,UnitPrice,UnitInStock FROM products'
    let request = new mssql.Request()

    let file_pdf_name = "./pdfexport/product-"+moment(new Date()).format("YYYY-MM-DD-ss")+".pdf"

    request.query(sql, (err, rows)=>{
        if(err){
            res.send(err)
            throw err
        }else{
            ejs.renderFile(path.join(__dirname,'../views/pages/backend/',"demopdf.ejs"),{products: rows.recordset}, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    }
                    pdf.create(data, options).toFile(file_pdf_name, function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {

                            // res.send("File created successfully")
                            res.download(file_pdf_name)

                            // ลบไฟล์ 
                            // fs.unlinkSync(file_pdf_name)
                        }
                    })
                }
            })
        }
    })
})

 module.exports = router