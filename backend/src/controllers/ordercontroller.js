const Cart = require('../models/cart_model');
const Order = require('../models/order_model');

exports.createorder = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const { shippingaddress, carrierService } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty!' });
        }

        const order = await Order.create({
            user: userId,
            items: cart.items,
            shippingaddress: shippingaddress || "No address provided",
            totalamount: req.body.totalPrice || cart.Total, // Use checkout's calculation if it included Express fees
            carrierService: carrierService || 'Standard'
        });

        await Cart.deleteOne({ user: userId });

        return res.status(201).json({ success: true, message: "Order placed successfully! 🚀", order });
    } catch (error) {
        next(error);
    }
};

exports.getallorders = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const getorders = await Order.find({ user: userId })
            .populate("items.product")
            .sort({ orderdate: -1 });

        if (!getorders || getorders.length === 0) {
            return res.status(404).json({ success: false, message: 'You have no orders yet!' });
        }

        return res.status(200).json({ success: true, message: 'All orders fetched successfully!', orders: getorders });
    } catch (error) {
        next(error);
    }
};

exports.getorderbyid = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.user.id;

        const getorders = await Order.findOne({ user: userId, _id: orderId }).populate("items.product");

        if (!getorders) {
            return res.status(404).json({ success: false, message: 'Order not found!' });
        }

        return res.status(200).json({ success: true, message: 'Order fetched successfully!', order: getorders });
    } catch (error) {
        next(error);
    }
};

exports.cancelorder = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const orderId = req.params.id;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        if (order.orderstatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled. Current status: ${order.orderstatus}`
            });
        }

        order.orderstatus = "cancelled";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully!",
            order
        });
    } catch (error) {
        next(error);
    }
};
