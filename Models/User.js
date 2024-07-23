const mongoose = require('mongoose');

const ReceivedOrderSchema = new mongoose.Schema({
    deliveryAddress: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    money: { type: Number, required: true },
    userName: { type: String, required: true },
    userNumber: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});

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
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            size: { type: String, required: true }
        }],
        totalCost: { type: Number, required: true },
        placedAt: { type: Date, default: Date.now }
    }],
    rewards: { type: Number, default: 0 },
    receivedOrders: [ReceivedOrderSchema] 
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
