express = require('express')
const fs = require('fs')
const path = require('path')
var aes256 = require('aes256');
const crypto = require('crypto');
const _mode = 'dev';
const https = require('https');
var ENCRYPTION_KEY = "6NpWJ524345384543584v3sdfv5sdg43fdsg53fdg2s9"
ENCRYPTION_KEY = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substr(0, 32);
var ntpClient = require('ntp-client');

var cmd = '';
console.log('-------------')
const winston = require('winston');
const logger = winston.createLogger({
   level: 'info',
   format: winston.format.json(),
   defaultMeta: { service: 'user-service' },
   transports: [
     new winston.transports.File({ filename: 'error.log', level: 'error' }),
     new winston.transports.File({ filename: 'combined.log' }),
   ],
 });
process.on('uncaughtException', function (error) {

   logger.error('There was an uncaught exception: ', error);
   logger.on('finish', () => {
     process.exit(1);
   });
  console.log('------------- \n')
  console.log(error.stack)
  console.log('------------- \n')
});


try {
   if(_mode == 'dev'){
      if (fs.existsSync(__dirname + '/conf.json') ) {
         var conf = fs.readFileSync(__dirname +"/conf.json").toString()
         var ciph = aes256.encrypt(ENCRYPTION_KEY,conf).toString()
         fs.writeFileSync(__dirname +"/ENV/param.conf" , ciph) 
         console.log('Wrote New Conf ..')
    }
   }else{
      if ( fs.existsSync(String(path.dirname(process.execPath)) + '/conf.json') ) {
         var conf = fs.readFileSync(String(path.dirname(process.execPath)) + "\\conf.json").toString()
         var ciph = aes256.encrypt(ENCRYPTION_KEY,conf).toString()
         fs.writeFileSync( String(path.dirname(process.execPath)) + "\\ENV\\param.conf" , ciph) 
         console.log('Wrote New Conf ..')
    }

   }
 }catch(err){
   console.error(err)
 }
console.log('if everything works fine delete conf.json file ..')
if(_mode == 'dev'){
   var con = fs.readFileSync(__dirname + "/ENV/param.conf").toString()
   var dec = aes256.decrypt(ENCRYPTION_KEY,con).toString()
   var decryptedJSON = JSON.parse(dec);
}else{
   var con = fs.readFileSync(String(path.dirname(process.execPath)) + "\\ENV\\param.conf").toString()
   var dec = aes256.decrypt(ENCRYPTION_KEY,con).toString()
   var decryptedJSON = JSON.parse(dec);
}
process.env.PORT = decryptedJSON['PORT']
process.env.m_host = decryptedJSON['m_host']
process.env.m_port = decryptedJSON['m_port']
process.env.m_user = decryptedJSON['m_user']
process.env.m_password = decryptedJSON['m_password']
process.env.m_database = decryptedJSON['m_database']
process.env.SESSION_SECRET = decryptedJSON['SESSION_SECRET']
process.env.chromePath = decryptedJSON['chromePath']
process.env.mode = decryptedJSON['mode']

const { SIGCHLD } = require('constants');
const { Cookie } = require('express-session');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
app = express();
const {options} = require('./Mysql provider/mysql_provider')
var childProc = require('child_process');

var sessionStore = new MySQLStore(options);
console.log('Attempt to Connect to Mysql Server ...')
app.use(session({
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
   name: 'sid',
   Cookie: {
      maxAge: 1000 * 60 * 60 * 2, 
      sameSite: true
   }
}));
console.log('Connected to Mysql Server ...')
console.log('Created store successfully')

app.get('/',function(req,res){
   res.redirect('/login/en')
})

const login = require('./Pages/login-Page/login.js')
app.use('/login/ar',login)

const loginen = require('./Pages/login-Page-en/login.js')
app.use('/login/en',loginen)


const register = require('./Pages/register-Page/register.js')
app.use('/register/ar',register)

const home = require('./Pages/home-Page/home.js')
app.use('/home/ar',home)
home.use(express.static(__dirname + '/Pages/home-Page/home-files'))

const homeen = require('./Pages/home-Page-en/home.js')
app.use('/home/en',homeen)

const companyvariables = require('./Pages/CompanyVariables-Page/companyvariables.js')
app.use('/companyvariables/ar',companyvariables)

const companyvariablesen = require('./Pages/CompanyVariables-Page-en/companyvariables.js')
app.use('/companyvariables/en',companyvariablesen)

const hotelsar = require('./Pages/hotels-Page/hotels.js')
app.use('/hotels/ar',hotelsar)


const hotelsaren = require('./Pages/hotels-Page-en/hotels.js')
app.use('/hotels/en',hotelsaren)

const restauurantsar = require('./Pages/restaurants-Page/restaurants.js')
app.use('/restaurants/ar',restauurantsar)

const restauurantsaren = require('./Pages/restaurants-Page-en/restaurants.js')
app.use('/restaurants/en',restauurantsaren)

const timesar = require('./Pages/times-Page/times.js')
app.use('/availabletime/ar',timesar)

const timesaren = require('./Pages/times-Page-en/times.js')
app.use('/availabletime/en',timesaren)

const verifyreservations = require('./Pages/verifyreservation-Page/verifyreservation.js')
app.use('/verifyreservation/ar',verifyreservations)

const verifyreservationsen = require('./Pages/verifyreservation-Page-en/verifyreservation.js')
app.use('/verifyreservation/en',verifyreservationsen)

const checknumbers = require('./Pages/checknumbers-Page/checknumbers.js')
app.use('/checknumbers/ar',checknumbers)

const checknumbersen = require('./Pages/checknumbers-Page-en/checknumbers.js')
app.use('/checknumbers/en',checknumbersen)

const newres = require('./Pages/new-reservation-Page/new-reservation.js')
app.use('/newreservation/ar',newres)

const newresen = require('./Pages/new-reservation-Page-en/new-reservation.js')
app.use('/newreservation/en',newresen)

const rep = require('./Pages/Reports-Page/report.js')
app.use('/reports/ar',rep)
rep.use(express.static(__dirname + '/Pages/Reports-Page/Reports-files'))

const repen = require('./Pages/Reports-Page-en/report.js')
app.use('/reports/en',repen)

const user = require('./Pages/Users-Page/users.js')
app.use('/users/ar',user)

const useren = require('./Pages/Users-Page-en/users.js')
app.use('/users/en',useren)

const restime = require('./Pages/restime-Page/restime.js')
app.use('/restime/ar',restime)

const restimeen = require('./Pages/restime-Page-en/restime.js')
app.use('/restime/en',restimeen)


/*ntpClient.getNetworkTime("0.africa.pool.ntp.org", 123, function(err, date) {
   if(err) {date = new Date(Date.now()); console.log("Unable to load Time .....") }
   var dat = new Date('June 1, 2024')
   if(date.getTime() > dat.getTime()){
      console.log("This Version is outdated: \' "+ dat +" \' please consult Software provider for extension")
      process.exit(1)
   }
});*/
/*

var cur =  Date.now();
var def = new Date('June 1, 2024');
if( cur > def ){
   console.log("This Version is outdated: \' "+ def +" \' please consult Software provider for extension")
   process.exit(1)
}
*/

app.use(function(request, response, next) {if (!request.secure) {return response.redirect("https://" + request.headers.host + request.url);}next();})

var optionss;
if(_mode == 'dev'){
 optionss = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
   };
}else{
 optionss = {
      key: fs.readFileSync( String(path.dirname(process.execPath)) + '/server.key'),
      cert: fs.readFileSync( String(path.dirname(process.execPath)) + '/server.crt')
   };
}
/*

require('dns').resolve('www.google.com', function(err) {
   if (err) {
      console.log("No Internet connection");
   } else {
      https.createServer(optionss,app).listen(process.env.PORT ,(error) =>{
         if(error){
          console.log('ERROR LISTENING: ' + error)
         }else{
          console.log('-------------')
          console.log('Server Started Listening on port: ' + 'https://localhost:'+process.env.PORT 
          + '\n' + 'Chrome will start automaticaly..' + '\n' + 'if not there is something wrong with chrome path in conf.json' + '\n' + 'V.3.00'
          ) 
         // childProc.exec(process.env.chromePath + " "  + 'https://localhost:'+ process.env.PORT);
         }
      });
   }
 });
*/


 
 https.createServer(optionss,app).listen(process.env.PORT ,(error) =>{
   if(error){
    console.log('ERROR LISTENING: ' + error)
   }else{
    console.log('-------------')
    console.log('Server Started Listening on port: ' + 'https://localhost:'+process.env.PORT 
    + '\n' + 'Chrome will start automaticaly..' + '\n' + 'if not there is something wrong with chrome path in conf.json' + '\n' + 'V.3.00'
    ) 
   // childProc.exec(process.env.chromePath + " "  + 'https://localhost:'+ process.env.PORT);
   }
});