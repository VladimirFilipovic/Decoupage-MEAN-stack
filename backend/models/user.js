const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//unique sluzi za optimizaciju ne validaciju
const userSchema = mongoose.Schema({
  username: {type:String, required:true, unique:true },
  password: {type:String, required:true},
});

//now we get error when inputing user with same username
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
