
const products = require('../models/product_model')
const users = require('../models/user_model')
const categorys = require('../models/category_model')
const { disconnect } = require('mongoose')
const orders = require('../models/order_model')

// create products (admin)

exports.createproduct = async (req,res) => {
    try {

        const {name, description, price, category, stock} = req.body
        const image = req.file ? req.file.filename : null

        if(!name || !price || isNaN(price) || price <= 0){
            return res.status(400).json({ message:'Valid Name and positive Price are required !'})
        }

        if (stock !== undefined && (isNaN(stock) || stock < 0)) {
            return res.status(400).json({ message:'Stock must be a non-negative number !'})
        }

        const product = await products.create({
            name,
            description,
            price,
            category,
            stock,
            image
        })

        return res.json({ message:'product created succesfully !',product})

    } catch (error) {
        console.error("Create Product Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// update products (admin)

exports.updateproduct = async (req,res) => {    

    try {
        const productid = req.params.id

        let product = await products.findById(productid)

        if(!product){
            return res.json({ message : 'product not found'})
        }

        const {name, description, price, category, stock} = req.body

        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (category) product.category = category
        if (stock) product.stock = stock

        if(req.file){
            product.image = req.file.filename
        }

        await product.save()

        return res.json({
            message:'product updated !',
            product
        })

    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// product delete (admin)

exports.deleteproduct = async (req,res) => {

    try {
        const productfordel =await products.findByIdAndDelete(req.params.id)

    if(!productfordel){
        return res.json({message:'product not found !'})
    }

    return  res.json({message:'product deleted !'})
    
    } catch (error) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// list all users

exports.listallusers = async (req,res) => {
    try{

    const userlist = await users.find({},{password:0})

    return res.json({message:'All users fetched successfully!',userlist})

    }catch(err){
        console.error("List Users Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// create categorys

exports.createcategory = async (req,res) => {

    try {

        const {name,description,createat} = req.body

        let image = null;
        if(req.file){
            image = `http://localhost:3001/uploads/${req.file.filename}`;
        }

        if(!name){
            return res.json({ message :'name is required !' })
        }

        const category = await categorys.create({
            name,
            description,
            image,
            createat
        })

        return res.json({message:'category created !',category})
    
    } catch (error) {
        console.error("Create Category Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// update category

exports.updatecategory = async(req,res) => {

try {
    const updateData = { ...req.body };
    if(req.file){
        updateData.image = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    const updatedata = await categorys.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new : true})


    if(!updatedata){

        return res.json({ message : 'category not found' })

    }

    return res.json({ message : 'category updated !',updatedata})

} catch (error) {
    console.error("Update Category Error:", error);
    return res.status(500).json({ message: 'Internal server error' });

} 
}   

// delete categery

exports.deletecategory = async (req,res) => {

try {
    const datadle = await categorys.findByIdAndDelete(req.params.id)

    if(!datadle){
        return res.json({ message : 'category not found !'})
    }

    return res.json({ messsage : 'category deleted !'})
} catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({ message: 'Internal server error' });
    
}  
}

// get all orders

exports.getallordersadmin = async (req, res) => {
    try {
        const allOrders = await orders.find()
            .populate('user', 'username email')
            .populate('items.product')
            .sort({ orderdate: -1 });

        if (!allOrders) {
            return res.json({ message: "No orders found!" })
        }

        return res.json({
            message: "All orders fetched successfully!",
            orders: allOrders
        });

    } catch (err) {
        console.error("Get All Orders Admin Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// order status

exports.updateorderstatus = async (req, res) => {
    try {
        const orderId = req.params.id
        const { status, carrierService } = req.body

        const validStatuses = ["pending", "shipped", "delivered", "cancelled"]

        if (!validStatuses.includes(status)) {
            return res.json({ message: "Invalid status value!" })
        }

        const updatePayload = { orderstatus: status };
        if (status === 'shipped') {
            updatePayload.shippedAt = Date.now();
            if (carrierService) updatePayload.carrierService = carrierService;
        }

        const updatedOrder = await orders.findByIdAndUpdate(
            orderId,
            updatePayload,
            { new: true }
        )

        if (!updatedOrder) {
            return res.json({ message: "Order not found!" })
        }

        return res.json({
            message: "Order status updated successfully!",
            order: updatedOrder
        })

    } catch (err) {
        console.error("Update Order Status Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// update user (admin)
exports.adminUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, role, status, password } = req.body;

        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (role) updatedData.role = role;
        if (status) updatedData.status = status;
        
        if (password) {
            const bcrypt = require('bcrypt');
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const user = await users.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        return res.json({
            success: true,
            message: "User updated successfully!",
            user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

