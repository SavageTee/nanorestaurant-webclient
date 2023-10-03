const express = require('express')
const {connection} = require('../../Mysql provider/mysql_provider')
const Joi = require('joi')
const { constants } = require('fs')
const verifyreservation = express.Router()
verifyreservation.use(express.urlencoded({ extended: true , limit: '100mb' }))
const nocache = require('nocache');
verifyreservation.use(nocache());
verifyreservation.use(Filter)
verifyreservation.get(verifyreservation.use(express.static(__dirname + '/verifyreservation-files')))


verifyreservation.post('/api/getreservations',(req,res)=>{
try
{
    if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
    if(Object.keys(req.body).length != 4) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };    
    if( Object.keys(req.body)[0] != "roomno" || Object.keys(req.body)[1] != "date" || Object.keys(req.body)[2] != "restaurant" || Object.keys(req.body)[3] != "hotel") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};

      if(req.session.hasOwnProperty('uname')){
        connection.getConnection(function(err, connection) {
            if(err) { 
                connection.release()        
                res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
            }else{
                connection.query("CALL Get_Reservations_web(?,?,?,?);",[req.body.roomno,req.body.date,req.body.restaurant,req.body.hotel], function (error, results, fields) {
                    if (error) {res.status(500).json({Status: "error",errorText: 'internal server error ' + error}); return;}; 
                    connection.release()        
                    res.status(200).json(results)                  
                });    
                
            }
        })
    }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
}catch(err){res.status(500).json({Status: "error",errorText: 'internal server errorss ' + err});return;}

})

verifyreservation.post('/api/editrestaurant',(req,res)=>{
    try
    {   
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 6) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "id" ||  Object.keys(req.body)[1] != "name"  ||  Object.keys(req.body)[2] != "country" || Object.keys(req.body)[3] != "about" || Object.keys(req.body)[4] != "photo" || Object.keys(req.body)[5] != "full_capacity") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{    
                    console.log(JSON.parse("[" + req.body.photo + "]")[0])           
                    if(req.body.photo != 'null' && req.body.photo.length != 0){
                        buff = Buffer.from(Uint8Array.from(JSON.parse("[" + req.body.photo + "]")), "utf8");
                        
                    }else{
                        buff = "";
                    }
                    connection.query("CALL alter_restaurant_web(?,?,?,?,?,?);",[req.body.id,req.body.name,req.body.country,req.body.about,buff,req.body.full_capacity], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};   
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})


verifyreservation.post('/api/verify',(req,res)=>{
    try
    {
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 4) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "id" ||  Object.keys(req.body)[1] != "roomno" || Object.keys(req.body)[2] != "date" || Object.keys(req.body)[3] != "restaurant") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{
                    connection.query("CALL verify_web(?,?,?,?,?);",[req.body.id,req.body.roomno,req.body.date,req.body.restaurant,req.session.uname], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};                      
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})


verifyreservation.post('/api/cancel',(req,res)=>{
    try
    {
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 4) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "id" ||  Object.keys(req.body)[1] != "roomno" || Object.keys(req.body)[2] != "date" || Object.keys(req.body)[3] != "restaurant") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{
                    connection.query("CALL cancel_web(?,?,?,?,?);",[req.body.id,req.body.roomno,req.body.date,req.body.restaurant,req.session.uname], function (error, results, fields) {
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


    if(req.session.permissions[4] == '0'){
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


module.exports = verifyreservation
