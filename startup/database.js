const mongoose = require('mongoose');
const winston = require('winston');

const config  = require('config');
module.exports = function()
{const db = config.get('db')
    mongoose.connect(db )
    .then(()=> winston.log("info","Connected to Mongodb " + db ))
    .catch(()=>{
        winston.log("info","Db disconnected")
    } );
    
}