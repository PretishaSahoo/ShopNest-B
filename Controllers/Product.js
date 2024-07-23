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

exports.addOrder = async (req, res) => {
    const { id } = req.params; 
    const { products, totalCost, deliveryAddress, deliveryDate, userName, userNumber } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productOwners = new Map();

        const orderPromises = products.map(async product => {
            const productDetails = await Product.findById(product.productId);
            if (!productDetails) {
                throw new Error(`Product not found: ${product.productId}`);
            }

            if (!productOwners.has(productDetails.productOwner)) {
                productOwners.set(productDetails.productOwner, {
                    deliveryAddress,
                    deliveryDate,
                    userName,
                    userNumber,
                    totalCost: 0,
                    orderDate: new Date(),
                    products: []
                });
            }

            const productOwnerDetails = productOwners.get(productDetails.productOwner);

            productOwnerDetails.totalCost += productDetails.price; 
            productOwnerDetails.products.push({
                productId: product.productId,
                size: product.size,
                totalCost: productDetails.price, 
                datePlaced: new Date() 
            });

            return {
                productId: product.productId,
                size: product.size,
                totalCost: productDetails.price, 
                datePlaced: new Date() 
            };
        });

        const orderDetails = await Promise.all(orderPromises);

        user.orders.push({
            products: orderDetails,
            totalCost, 
            placedAt: new Date()
        });

        user.cart = [];

        await user.save();

        for (const [ownerId, receivedOrderDetails] of productOwners) {
            await User.findByIdAndUpdate(ownerId, {
                $push: {
                    receivedOrders: {
                        deliveryAddress: receivedOrderDetails.deliveryAddress,
                        deliveryDate: receivedOrderDetails.deliveryDate,
                        money: receivedOrderDetails.totalCost,
                        userName: receivedOrderDetails.userName,
                        userNumber: receivedOrderDetails.userNumber,
                        orderDate: receivedOrderDetails.orderDate, 
                        products: receivedOrderDetails.products 
                    }
                }
            });
        }

        res.status(200).json({ message: "Order placed and cart cleared" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.fetchReceivedOrders = async (req, res) => {
    const { userid } = req.params;

    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.receivedOrders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.fetchOrders = async (req, res) => {
    const { userid } = req.params;

    try {
        const user = await User.findOne({ _id: userid }).populate('orders.products.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sortedOrders = user.orders.sort((a, b) => b.placedAt - a.placedAt);

        const orderDetails = sortedOrders.map(order => ({
            products: order.products.map(product => ({
                productId: product.productId._id,
                productName: product.productId.productName,
                productDesc: product.productId.productDesc,
                price: product.productId.price,
                productImageURL: product.productId.productImageURL,
                size: product.size
            })),
            totalCost: order.totalCost,
            placedAt: order.placedAt
        }));

        res.status(200).json({ orders: orderDetails });
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

