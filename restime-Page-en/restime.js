const express = require('express')
const {connection} = require('../../Mysql provider/mysql_provider')
const Joi = require('joi')
const { constants } = require('fs')
const restime = express.Router()
restime.use(express.urlencoded({ extended: true }))
const nocache = require('nocache');
restime.use(nocache());
restime.use(Filter)
restime.get(restime.use(express.static(__dirname + '/restime-files')))


restime.get('/api/getrestime',(req,res)=>{
try
{
    if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;} ; 
    if(req.session.hasOwnProperty('uname')){
        connection.getConnection(function(err, connection) {
            if(err) { 
                connection.release()        
                res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
            }else{
                connection.query("CALL get_restime_web();",[], function (error, results, fields) {
                    if (error) {res.status(500).json({Status: "error",errorText: 'internal server error ' + error}); return;}; 
                    connection.release()        
                    res.status(200).json(results)                  
                });    
                
            }
        })
    }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
}catch(err){res.status(500).json({Status: "error",errorText: 'internal server errorss ' + err});return;}

})

restime.post('/api/editrestime',(req,res)=>{
    try
    {   
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 4) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "id" ||  Object.keys(req.body)[1] != "from" ||  Object.keys(req.body)[2] != "to" ||  Object.keys(req.body)[3] != "enabled") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{               
                    connection.query("CALL alter_restime_web(?,?,?,?);",[req.body.id,req.body.from,req.body.to,req.body.enabled], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};   
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})


restime.post('/api/deleterestime',(req,res)=>{
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
                    connection.query("CALL delete_restime_web(?,?);",[req.body.id,req.session.uname], function (error, results, fields) {
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


    if(req.session.permissions[9] == '0' && req.path == "/"){
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


module.exports = restime
