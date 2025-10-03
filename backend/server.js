const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const { router: authRoutes } = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/posts', require('./routes/posts'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/bans', require('./routes/bans'));

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
