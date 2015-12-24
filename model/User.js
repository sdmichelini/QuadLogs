// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : { type: String, required: true, index: { unique: true} },
        password     : { type: String, required: true },
        username     : String
    },
    scopes :[String] //Access Level

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.pre('save', function(next){
  var user = this;
  //Don't rehash unless we get a new password
  if(!user.isModified('local.password'))return next();
  //Hash the Password
  user.local.password = user.generateHash(user.local.password);

  return next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
