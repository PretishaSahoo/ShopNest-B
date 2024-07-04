const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    role: { type: String, enum: ['Brand', 'User'], default: 'User' },
    password: { type: String, required: true },
    address: { type: String, required: true },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: { type: String, required: true }
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: { type: String, required: true }
    }],
    rewards: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
