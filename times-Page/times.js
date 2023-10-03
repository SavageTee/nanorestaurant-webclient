const express = require('express')
const session = require('express-session')
const times = express.Router()
times.use(express.urlencoded({ extended: true }))
const nocache = require('nocache');
times.use(nocache());
times.use(Filter)
times.get(times.use(express.static(__dirname + '/times-files')))



times.post('/api/edittimes',(req,res)=>{
    try
    {
        if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;};
        if(Object.keys(req.body).length != 4) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; };  
        if( Object.keys(req.body)[0] != "rowid" || Object.keys(req.body)[1] != "day" || Object.keys(req.body)[2] != "dates" || Object.keys(req.body)[3] != "prices") { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
        if(req.session.hasOwnProperty('uname')){
            connection.getConnection(function(err, connection) {
                if(err) { 
                    connection.release()        
                    res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                }else{
                    connection.query("CALL alter_times_web(?,?,?,?);",[req.body.rowid,req.body.day,Buffer.from(req.body.dates,'utf-8'),req.body.prices], function (error, results, fields) {
                        if (error) {res.status(500).json({Status: "error",errorText: 'internal server error'+error}); return;};                      
                        connection.release()        
                        res.status(200).json(results)                  
                    });        
                }
            })
        }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
    }catch(err){res.status(500).json({Status: "error",errorText: 'internal server error' + err});return;}   
})


    

    times.post('/api/getavailablewtime',(req,res)=>{
        try
        {
            if((req.headers['content-type'] != "application/x-www-form-urlencoded; charset=UTF-8")) {res.status(404).jsonp({ Status: 'error' , errorText: "bad request headers" }); return;}; 
            if(Object.keys(req.body).length != 3) {res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return; }; 
            if((Object.keys(req.body)[0] != "restaurant" ) || (Object.keys(req.body)[1] != "month" ) || (Object.keys(req.body)[2] != "year" )) { res.status(403).jsonp({ Status: 'error' , errorText: "Invalid request parameters" }); return;};
            if(req.session.hasOwnProperty('uname')){
                connection.getConnection(function(err, connection) {
                    if(err) { 
                        connection.release()        
                        res.status(500).json({Status: "error",errorText: 'internal server error' + err}); return; 
                    }else{
                        connection.query("CALL get_restaurants_date_timed_web(?,?,?,?);",[req.session.uname,req.body.restaurant,req.body.month,req.body.year], function (error, results, fields) {
                            if (error) {res.status(500).json({Status: "error",errorText: 'internal server error ' + error}); return;}; 
                            connection.release()        
                            res.status(200).json(results)                  
                        });    
                        
                    }
                })
            }else{ res.status(401).json({ Status: "error", errorText: 'Login Error' + err }); return;}
        }catch(err){res.status(500).json({Status: "error",errorText: 'internal server errorss ' + err});return;}
        
        })
         
 times.get('/api/uname',(req,res)=>{
    if(req.session.hasOwnProperty('uname')){
        res.status(200).jsonp({'Status' : 'Success' , 'value' : req.session.uname})
    }else{
        res.status(401).jsonp({'Status' : 'error' , 'errorText' : "Not Logged in"})
        req.session.destroy();
        res.redirect('/login/ar')
    }
})


times.post('/api/logout',(req,res)=>{
    if(req.session.hasOwnProperty('uname')){
        req.session.destroy();
        res.redirect('/login/ar')
    }
})


function Filter(req,res,next){

    if(req.session.permissions[3] == '0' && req.path == "/"){
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


    if(req.session.hasOwnProperty('uname')){
        next()
    }else{ 
        res.redirect('/login' + req.baseUrl.substr(req.baseUrl.length - 3))
    }
    
    }
module.exports = times
