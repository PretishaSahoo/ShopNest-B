const mongoose = require("mongoose");

const ProductSchema =new mongoose.Schema({
    productName : {type : String ,required:true},
    productDesc: {type : String , required:true},
    price :{ type:Number , required: true },
    productImageURL:{type : String , required:true},
    productOwner : {type:String , ref:"User" , required:true},
    productOwnerName:{type : String , required:true},
    orders:[ {customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}  , customerName: { type: String, required: true }} ],
    sizes: { type: [String], enum: ['S', 'M', 'L', 'XL'], required: true }
});

const Product = mongoose.model("Product" , ProductSchema );
module.exports = Product;    