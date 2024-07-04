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
    const { productId, size } = req.body; 

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!productId || !size) {
            return res.status(400).json({ message: 'Product ID and size are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        user.cart.push({ productId, size });
        await user.save();
        res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.addToWishlist = async (req, res) => {
    const { id } = req.params;
    const { productId } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({ message: "Product added to Wishlist" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.addOrder = async (req, res) => {
    const { id } = req.params;
    const { productId, size } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!productId || !size) {
            return res.status(400).json({ message: 'Product ID and size are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        user.orders.push({ productId, size });
        await user.save();
        res.status(200).json({ message: "Product added to orders" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    const { productId } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();

        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    const { productId } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.fetchCart = async (req, res) => {
    const { userid } = req.params;

    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const cartItems = await Promise.all(
            user.cart.map(async item => {
                const product = await Product.findById(item.productId);
                if (product) {
                    return { ...product.toObject(), size: item.size };
                }
                return null;
            })
        );

        const filteredCartItems = cartItems.filter(item => item !== null);

        res.status(200).json({ cart: filteredCartItems });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.fetchWishlist = async (req, res) => {
    const { userid } = req.params;

    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const wishlistProducts = await Promise.all(
            user.wishlist.map(async productId => {
                const product = await Product.findById(productId);
                return product ? product.toObject() : null;
            })
        );

        const filteredWishlistProducts = wishlistProducts.filter(product => product !== null);

        res.status(200).json({ wishlist: filteredWishlistProducts });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.fetchOrders = async (req, res) => {
    const { userid } = req.params;

    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const orderDetails = await Promise.all(
            user.orders.map(async orderItem => {
                const product = await Product.findById(orderItem.productId);
                if (product) {
                    return { ...product.toObject(), size: orderItem.size };
                }
                return null;
            })
        );

        const filteredOrderDetails = orderDetails.filter(item => item !== null);

        res.status(200).json({ orders: filteredOrderDetails });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


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

