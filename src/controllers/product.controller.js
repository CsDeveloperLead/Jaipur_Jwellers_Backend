import { Product } from "../model/product.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// get all products
export const getAllProducts = async (req, res) => {
    try {
        // If no pagination is specified
        if (!req.query.page && !req.query.limit) {
            const products = await Product.find();

            const transformedProducts = products.map(product => ({
                ...product.toObject(),
                details: product.details.map(detailObj => detailObj.details),
            }));

            return res.status(200).json(transformedProducts);
        }

        // Handle pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const productList = await Product.find().skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments();

        const transformedProductList = productList.map(product => ({
            ...product.toObject(),
            details: product.details.map(detailObj => detailObj.details),
        }));

        res.status(200).json({
            products: transformedProductList,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            hasMore: page * limit < totalProducts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//logic to get single product
export const getSingleProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }

    try {
        const product = await Product.findById(id);

        if (product) {
            // Transform `details` field
            const transformedProduct = {
                ...product.toObject(),
                details: product.details.map(detailObj => detailObj.details), // Flatten `details`
            };

            res.status(200).json(transformedProduct);
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            product_id,
            desc,
            category,
            countInStock,
            quantityPrices,
            model,
            weight,
            width,
            height,
            depth,
            details,
            image1Color,
            image2Color,
            image3Color
        } = req.body;

        if (!req.files?.Image || !req.files?.Image1 || !req.files?.Image2 || !req.files?.Image3) {
            return res.status(400).json({
                error: "Images are required"
            })
        }
        const image = await uploadOnCloudinary(req.files.Image[0].path)
        const image1 = await uploadOnCloudinary(req.files.Image1[0].path)
        const image2 = await uploadOnCloudinary(req.files.Image2[0].path)
        const image3 = await uploadOnCloudinary(req.files.Image3[0].path)
        const updateData = {
            name,
            product_id,
            desc,
            category,
            countInStock,
            model,
            weight,
            width,
            height,
            depth,
            details: JSON.parse(details).map(detail => ({ details: detail })),
            quantityPrices: JSON.parse(quantityPrices),
            Image: image.secure_url,
            Image1: {
                image: image1.secure_url,
                color: image1Color
            },
            Image2: {
                image: image2.secure_url,
                color: image2Color
            },
            Image3: {
                image: image3.secure_url,
                color: image3Color
            }
        };

        const isProductExist = await Product.findOne({ product_id });
        if (isProductExist) {
            return res.status(400).json({
                success: false,
                message: "Product already exists",
            });
        }

        const newProduct = new Product(updateData);

        const response = await newProduct.save();
        if (response) {
            res.status(201).json({ success: true });
        } else {
            res
                .status(400)
                .json({ success: false, message: "Error creating product" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const {
            name,
            desc,
            category,
            countInStock,
            quantityPrices,
            model,
            weight,
            width,
            height,
            depth,
            details,
            image1Color,
            image2Color,
            image3Color
        } = req.body;

        // Check if the product exists
        const isProductExist = await Product.findOne({ product_id });
        if (!isProductExist) {
            return res.status(404).json({
                success: false,
                message: "Product doesn't exist",
            });
        }

        const updateData = {};

        // Update fields if provided
        if (name) updateData.name = name;
        if (desc) updateData.desc = desc;
        if (category) updateData.category = category;
        if (countInStock) updateData.countInStock = countInStock;
        if (model) updateData.model = model;
        if (weight) updateData.weight = weight;
        if (width) updateData.width = width;
        if (height) updateData.height = height;
        if (depth) updateData.depth = depth;
        if (image1Color) updateData["Image1.color"] = image1Color;
        if (image2Color) updateData["Image2.color"] = image2Color;
        if (image3Color) updateData["Image3.color"] = image3Color;
        if (quantityPrices) updateData.quantityPrices = JSON.parse(quantityPrices);
        if (details) {
            updateData.details = JSON.parse(details).map(detail => ({ details: detail }));
        }

        if (req.files) {
            if (req.files.Image) {
                const image = await uploadOnCloudinary(req.files.Image[0].path);
                updateData.Image = image.secure_url;
            }
            if (req.files.Image1) {
                const image1 = await uploadOnCloudinary(req.files.Image1[0].path);
                updateData.Image1.image = image1.secure_url;
            }
            if (req.files.Image2) {
                const image2 = await uploadOnCloudinary(req.files.Image2[0].path);
                updateData.Image2.image = image2.secure_url;
            }
            if (req.files.Image3) {
                const image3 = await uploadOnCloudinary(req.files.Image3[0].path);
                updateData.Image3.image = image3.secure_url;
            }
        }

        // Perform the update operation
        const response = await Product.findOneAndUpdate(
            { product_id: product_id },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (response) {
            res.status(200).json({ success: true, product: response });
        } else {
            res.status(400).json({ success: false, message: "Error updating product" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }

    try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}