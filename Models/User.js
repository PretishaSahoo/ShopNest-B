const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {type:String , required:true },
    email: { type: String, required: true, unique: true },
    phone : { type:Number , required: true},
    role:{ type: String, enum: ['Brand', 'User'], default: 'User'},
    password:{ type:String, required:true } , 
    address : { type:String, required:true } ,
    cart : [{type:String , ref:"Product"}],
    wishlist : [{type:String , ref:"Product"}],
    orders : [{type:String , ref:"Product"}],
    rewards:{type:Number , default:0}
})

const User = mongoose.model("User" , UserSchema);
module.exports = User ;