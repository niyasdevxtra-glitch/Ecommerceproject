const Cart = require('../models/cart_model');
const Product = require('../models/product_model');

async function totalamount(cart) {
    let total = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
}

exports.addtocart = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { productid, quantity, shippingMethod } = req.body;

        const product = await Product.findById(productid);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productid, quantity: quantity || 1, shippingMethod: shippingMethod || 'Standard' }]
            });
        } else {
            const itemindex = cart.items.findIndex(
                (item) => item.product.toString() === productid
            );

            if (itemindex > -1) {
                cart.items[itemindex].quantity += quantity || 1;
                // If they re-add as Express, upgrade the whole stack
                if (shippingMethod === 'Express') cart.items[itemindex].shippingMethod = 'Express';
            } else {
                cart.items.push({ product: productid, quantity: quantity || 1, shippingMethod: shippingMethod || 'Standard' });
            }
        }

        cart.Total = await totalamount(cart);
        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({ success: true, message: 'Product added to cart!', cart });
    } catch (error) {
        next(error);
    }
};

exports.getcart = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [], Total: 0 } });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

exports.updatecart = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { productid, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found!' });
        }

        const itemindex = cart.items.findIndex(
            (item) => item.product.toString() === productid
        );

        if (itemindex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart!' });
        }

        cart.items[itemindex].quantity = quantity;
        cart.Total = await totalamount(cart);
        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({ success: true, message: 'Quantity updated!', cart });
    } catch (error) {
        next(error);
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { productid } = req.body;

        if (!productid) {
            return res.status(400).json({ success: false, message: "Product ID is required!" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found!" });
        }

        const itemindex = cart.items.findIndex(
            (item) => item.product.toString() === productid
        );

        if (itemindex === -1) {
            return res.status(404).json({ success: false, message: "Product not in cart!" });
        }

        cart.items.splice(itemindex, 1);

        if (cart.items.length === 0) {
            await cart.deleteOne();
            return res.status(200).json({ success: true, message: "Product removed & cart deleted!", cart: { items: [], Total: 0 } });
        }

        await cart.save();
        await cart.populate("items.product");
        return res.status(200).json({ success: true, message: "Product removed from cart!", cart });
    } catch (error) {
        next(error);
    }
};

exports.mergecart = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { items } = req.body;

        if (!items || !items.length) {
            return res.status(200).json({ success: true, message: "No items to merge." });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        for (const guestItem of items) {
            const productid = guestItem.productId?._id || guestItem.productId;
            const quantity = guestItem.quantity || 1;
            const shippingMethod = guestItem.shippingMethod || 'Standard';

            if (!productid) continue;

            const productExists = await Product.findById(productid);
            if (!productExists) continue;

            const existingIndex = cart.items.findIndex(
                (item) => item.product.toString() === productid.toString()
            );

            if (existingIndex > -1) {
                cart.items[existingIndex].quantity += quantity;
                if (shippingMethod === 'Express') cart.items[existingIndex].shippingMethod = 'Express';
            } else {
                cart.items.push({ product: productid, quantity, shippingMethod });
            }
        }

        cart.Total = await totalamount(cart);
        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({ success: true, message: "Cart merged successfully!", cart });
    } catch (error) {
        next(error);
    }
};
