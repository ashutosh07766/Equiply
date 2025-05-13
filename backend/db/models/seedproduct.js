const mongoose = require('mongoose');
const products = require('./products'); 
const connectDB = require('./connection');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: String, required: true },
    seller: { type: String, required: true },
    location: { type: String, required: true },
    availability: { type: String, required: true },
    renting: {
        hours: { type: Number, required: false },
        days: { type: Number, required: false },
        weeks: { type: Number, required: false },
        months: { type: Number, required: false },
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

const seedProducts = async () => {
    try {
        await connectDB(); 
        await Product.deleteMany();
        console.log('Old products removed.');

        await Product.insertMany(products);
        console.log('Products added to the database.');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
    finally {
        await mongoose.disconnect()
    }
};

seedProducts();