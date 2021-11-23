//import DB Config
const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '123456',
    database : 'smartinvdb',
    port     : 3333
})
connection.connect((error)=>{
    if(!!error){
        console.log(error)
    }else{
        console.log('Database Connected Success')
    }
})

module.exports = connection