const products = require('../models/product_model')
const categorys =require('../models/category_model')

// get all prodects (public)

exports.getallprodects = async (req,res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const prodect = await products.find(filter)

        return res.json(prodect)
    } catch (error) {
        console.error("Get All Products Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}

// get single prodect by id (public)

exports.getsingleprodect = async (req,res) => {

    try {
        const prodect = await products.findById(req.params.id)

    if(!prodect){
        return res.json({message:'prodect not found !'})
    }

    return res.json(prodect)
    
    } catch (error) {
        console.error("Get Single Product Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// get all category 

exports.getallcategory = async (req,res) => {

    try {
        const allcategory = await categorys.find({})

        return res.json(allcategory)

    } catch (error) {
        console.error("Get All Categories Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}






