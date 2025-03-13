const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// MongoDB Connection URL
const MONGODB_URI = 'mongodb://localhost:27017/carShowcase';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the User model
const User = mongoose.model('User', userSchema, 'users');

// Define the Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true }, // Price is stored in rupees
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

// Create the Vehicle model
const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'vehicles');

// Define the Ad Schema
const adSchema = new mongoose.Schema({
    logoUrl: { type: String, required: true },
    text: { type: String, required: true },
    redirectUrl: { type: String, required: true }, // Added redirect URL
    createdAt: { type: Date, default: Date.now }
});

// Create the Ad model
const Ad = mongoose.model('Ad', adSchema, 'ads');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to authenticate user
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Routes

// User signup
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single vehicle by ID
app.get('/api/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new vehicle
app.post('/api/vehicles', async (req, res) => {
    try {
        const newVehicle = new Vehicle(req.body);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update vehicle
app.put('/api/vehicles/:id', async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search vehicles
app.get('/api/vehicles/search', async (req, res) => {
    try {
        const { brand, color, sort } = req.query;
        const query = {};
        
        if (brand) {
            query.brand = new RegExp(brand, 'i');
        }
        if (color) {
            query.color = color;
        }
        
        let vehicles = await Vehicle.find(query);
        
        if (sort === 'price') {
            vehicles = vehicles.sort((a, b) => a.price - b.price);
        }
        
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all ads
app.get('/api/ads', async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single ad by ID
app.get('/api/ads/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.json(ad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update ad
app.put('/api/ads/:id', async (req, res) => {
    try {
        const updatedAd = await Ad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAd) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.json(updatedAd);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete ad
app.delete('/api/ads/:id', async (req, res) => {
    try {
        const deletedAd = await Ad.findByIdAndDelete(req.params.id);
        if (!deletedAd) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new ad
app.post('/api/ads', async (req, res) => {
    try {
        const newAd = new Ad(req.body);
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Upload and parse Excel file
app.post('/api/upload', upload.single('excelFile'), async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const vehicles = data.map(row => ({
            brand: row.Brand,
            model: row.Model,
            year: row.Year,
            price: row.Price,
            imageUrl: row.ImageUrl,
            description: row.Description,
            specifications: {
                engine: row.Engine,
                transmission: row.Transmission,
                mileage: row.Mileage,
                fuelType: row.FuelType
            }
        }));

        await Vehicle.insertMany(vehicles);
        res.status(201).json({ message: 'Vehicles added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the client files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
