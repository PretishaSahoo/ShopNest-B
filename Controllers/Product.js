const Product = require ("../Models/Product");
const User = require("../Models/User");

exports.addProduct = async(req,res) =>{
    const product = req.body ;
    try {
        const newProduct = new Product(product);
        const doc = await newProduct.save();
        res.status(201).json({doc:doc ,message:"Product Created!"});
    } catch (error) {
        console.log(error.message);
    }
}

exports.deleteProduct = async(req,res) =>{
    const {id} = req.params;
    try {
        const product = await Product.findByIdAndDelete({ _id: id });
        if(!product){
            return res.status(404).json({error:"Product not found!"})
        }
        res.status(200).json({message:"Product deleted Successfully"})
    }
    catch(error){
        console.log(error.message);
    }
}

exports.editProduct = async(req,res)=>{
    const {id} = req.params;
    try {
        const newProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (newProduct) {
            res.status(200).json({ "Edited Product": newProduct, "status": "updated" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.addToCart = async (req, res) => {
    const { id } = req.params; 
    const { product } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cart.push(product); 
        const updatedUser = await user.save();
        res.status(200).json({  message: "Product added to cart" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.addToWishlist = async(req,res)=>{
    const { id } = req.params;
    const { product } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.wishlist.push(product);
        const updatedUser = await user.save();

        res.status(200).json({  message: "Product added to Wishlist" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}
exports.addOrder = async (req,res) =>{
    const { id } = req.params;
    const { product } = req.body;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.orders.push(product);
        const updatedUser = await user.save();

        res.status(200).json({message: "Product added to Orders" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== product);
        const updatedUser = await user.save();

        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.toString() !== product);
        const updatedUser = await user.save();

        res.status(200).json({  message: "Product removed from cart" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchCart = async(req,res) =>{
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart:user.cart });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }

} 

exports.fetchWishlist = async(req,res) =>{
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ wishlist:user.wishlist});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
} 

exports.fetchOrders = async(req,res) =>{
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ orders:user.orders});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
} 

exports.fetchProductsForAll = async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchProductsBrand = async(req,res)=>{
    const {id} = req.params; 
    try {
        const products = await Product.find({ productOwner : id});
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }

}

