const mongoose = require('mongoose');
const config=require('config');
 

const uri = config.get('DB_STRING');

exports.connectToDb=()=>{
    mongoose.connect(uri).then(()=>console.log(`Database connect ho gya`))
    .catch(()=>console.log(`Tumse na ho payega`))
}

