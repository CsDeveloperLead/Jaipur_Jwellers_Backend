import mongoose, { Schema } from 'mongoose'


const quantityPriceSchema = Schema({
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const productSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
    Image: {
        type: Buffer, // Store main image as binary data
        default: null,
    },
    Image1: {
        type: Buffer, // Store additional images as binary data
        default: null,
    },
    Image2: {
        type: Buffer, // Store additional images as binary data
        default: null,
    },
    Image3: {
        type: Buffer, // Store additional images as binary data
        default: null,
    },
    desc: {
        type: String,
        required: true,
    },
    quantityPrices: [quantityPriceSchema],
    category: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

// Exporting the model
export const Product = mongoose.model("Product", productSchema);