const express = require('express')
const {connection} = require('../../Mysql provider/mysql_provider')
const Joi = require('joi')
const { constants } = require('fs')
const users = express.Router()
users.use(express.urlencoded({ extended: true }))
const nocache = require('nocache');
users.use(nocache());
users.use(Filter)
const crypto = require('crypto');
users.get(users.use(express.static(__dirname + '/users-files')))


users.get('/api/getusers',(req,res)=>{
try
{
    if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;} ; 
    if(req.session.hasOwnProperty('uname')){
        connection.getConnection(function(err, connection) {
            if(err) { 
                connection.release()        
                res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
            }else{
                connection.query("CALL Get_All_Users();",[], function (error, results, fields) {
                    if (error) {res.status(500).json({Status: "error",errorText: 'internal server error ' + error}); return;}; 
                    connection.release()        
                    res.status(200).json(results)                  
                });    
                
            }
        })
    }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
}catch(err){res.status(500).json({Status: "error",errorText: 'internal server errorss ' + err});return;}

})

users.post('/api/editusers',(req,res)=>{
    try
    {   
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 13) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "usercode" ||  Object.keys(req.body)[1] != "namefoot" ||  Object.keys(req.body)[2] != "passwordfooter"  ||  Object.keys(req.body)[3] != "companyfooter"  ||  Object.keys(req.body)[4] != "timefooter"  ||  Object.keys(req.body)[5] != "hotelfooter"  ||  Object.keys(req.body)[6] != "restaurantfooter"  ||  Object.keys(req.body)[7] != "verifyfooter"  ||  Object.keys(req.body)[8] != "reportsfooter"  ||  Object.keys(req.body)[9] != "reservefooter"  ||  Object.keys(req.body)[10] != "numbersfooter"  ||  Object.keys(req.body)[11] != "usersfooter" ||  Object.keys(req.body)[12] != "restimefooter"   ) { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{               
                    connection.query("CALL alter_userss_web(?,?,?,?,?,?,?,?,?,?,?,?,?);",[req.body.usercode,req.body.namefoot,crypto.createHash('sha256').update(req.body.passwordfooter).digest('hex'),req.body.companyfooter,req.body.timefooter,req.body.hotelfooter,req.body.restaurantfooter,req.body.verifyfooter,req.body.reportsfooter,req.body.reservefooter,req.body.numbersfooter,req.body.usersfooter,req.body.restimefooter], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};   
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})


users.post('/api/deleteuser',(req,res)=>{
    try
    {
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 1) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "id") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{
                    connection.query("CALL delete_user_web(?);",[req.body.id], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};                      
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})
    



function Filter(req,res,next){


    if(req.session.permissions[8] == '0' && req.path == "/"){
        res.set('Content-Type', 'text/html');
        res.status(500).send(Buffer.from(`
        <html>
         <body>
           <center>
           <h1> X <h1>
           <h2> No sufficient privilege to access this page <h2>
           </center>
           
           <style>
           body{
               background-color: red;
           }
           h1{
               color: white;
               font-size: 250px;
           }
           h2{
               color: white;
               font-size: 80px;
           }
           </style>
         </body>
        </html>
        `));
        return;
        }   


if(req.session.hasOwnProperty('uname')){ next()}else{ res.redirect('/login' + req.baseUrl.substr(req.baseUrl.length - 3)); }
}


module.exports = users
