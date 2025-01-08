const mongoose = require('mongoose');

// MongoDB Connection URL
const MONGODB_URI = 'mongodb://127.0.0.1:27017/carShowcase';

// Sample vehicle data
const sampleVehicles = [
    {
        brand: "BMW",
        model: "M5",
        year: 2024,
        price: 105000,
        imageUrl: "https://imgd.aeplcdn.com/664x374/n/cw/ec/192747/m5-exterior-right-front-three-quarter-2.jpeg",
        description: "M5 Competition with 717 bhp",
        specifications: {
            engine: "4395 cc",
            transmission: "Automatic (TC)",
            mileage: "8.5 kmpl",
            fuelType: "Petrol"
        }
    },
    {
        brand: "Rolls-Royce",
        model: "Phantom",
        year: 2024,
        price: 450000,
        imageUrl: "https://imgd.aeplcdn.com/664x374/n/cw/ec/30181/phantom-exterior-right-front-three-quarter.jpeg",
        description: "Phantom Sedan with ultimate luxury",
        specifications: {
            engine: "6749 cc",
            transmission: "Automatic",
            mileage: "7.1 kmpl",
            fuelType: "Petrol"
        }
    }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Define the Schema
    const vehicleSchema = new mongoose.Schema({
        brand: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        description: { type: String, required: true },
        specifications: {
            engine: String,
            transmission: String,
            mileage: String,
            fuelType: String
        },
        createdAt: { type: Date, default: Date.now }
    });

    // Create the model
    const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'vehicles');

    try {
        // Clear existing data
        await Vehicle.deleteMany({});
        console.log('Cleared existing vehicles');

        // Insert sample data
        const result = await Vehicle.insertMany(sampleVehicles);
        console.log(`Successfully inserted ${result.length} vehicles`);
    } catch (error) {
        console.error('Error populating database:', error);
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});