//import DB Config
//const mssql = require('mssql')

const config = {
    user     : 'node',
    password : 'Nj@2021',
    server   : '192.168.1.72',   
    database : 'smartinvdb',
    options:{
        trustedconection: true,
        enableArithAbort: true,
        trustServerCertificate :true,
        encrypt:false
    }
    //port:1433
}
module.exports = config