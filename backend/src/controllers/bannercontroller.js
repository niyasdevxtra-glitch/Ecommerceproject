const Banner = require('../models/banner_model');

exports.getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find({});
        res.status(200).json({ success: true, count: banners.length, banners });
    } catch (error) {
        next(error);
    }
};

exports.createBanner = async (req, res, next) => {
    try {
        const { type, category, title, highlight, subtitle, link, productCategory } = req.body;
        
        let src = req.body.src; // Fallback to provided URL string

        if (req.file) {
            src = `/uploads/${req.file.filename}`;
        }

        if (!type || !category) {
            return res.status(400).json({ success: false, message: "Type and category are required" });
        }

        const banner = await Banner.create({
            type, category, src, title, highlight, subtitle, link, productCategory
        });

        res.status(201).json({ success: true, message: "Banner created successfully!", banner });
    } catch (error) {
        next(error);
    }
};

exports.updateBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.id;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.src = `/uploads/${req.file.filename}`;
        }

        const banner = await Banner.findByIdAndUpdate(bannerId, updateData, { new: true });

        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        res.status(200).json({ success: true, message: "Banner updated successfully!", banner });
    } catch (error) {
        next(error);
    }
};

exports.deleteBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.id;
        const banner = await Banner.findByIdAndDelete(bannerId);

        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        res.status(200).json({ success: true, message: "Banner deleted successfully!" });
    } catch (error) {
        next(error);
    }
};
