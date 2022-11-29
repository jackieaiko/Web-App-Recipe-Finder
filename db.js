const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/"; 
const DB_NAME = "webApp"; 


mongoose.connect(url + DB_NAME, { useNewUrlParser: true });

module.exports = mongoose;