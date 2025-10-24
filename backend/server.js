const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./lib/prisma');
const auth = require('./middleware/auth');
const TravelPlannerAgent = require('./agents/TravelPlannerAgent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const travelAgent = new TravelPlannerAgent();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Travel Plannar Backend API' });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected trip routes
app.get('/api/trips', auth, async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.userId },
      include: { bookings: true }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips', auth, async (req, res) => {
  try {
    const trip = await prisma.trip.create({
      data: { ...req.body, userId: req.user.userId }
    });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.post('/api/test-plan', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple mock response
    const mockResult = {
      intent: {
        destination: "Paris",
        tripType: "leisure",
        budget: 1500,
        duration: 7,
        travelers: 2,
        preferences: ["sightseeing"]
      },
      options: {
        flights: [{ airline: "Air France", price: 450 }],
        hotels: [{ name: "Hotel Paris", price: 120 }],
        activities: [{ name: "Eiffel Tower", price: 25 }]
      },
      itinerary: "Day 1: Arrive in Paris...",
      totalBudget: { total: 1500 }
    };

    res.json({ planning: mockResult });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Travel Planning endpoint
app.post('/api/plan-trip', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const planningResult = await travelAgent.generateItinerary(message);
    
    // Save trip to database
    const trip = await prisma.trip.create({
      data: {
        title: `Trip to ${planningResult.intent.destination}`,
        description: message,
        destination: planningResult.intent.destination,
        startDate: new Date(),
        endDate: new Date(Date.now() + planningResult.intent.duration * 24 * 60 * 60 * 1000),
        budget: planningResult.totalBudget.total,
        userId: req.user.userId
      }
    });



    res.json({
      trip,
      planning: planningResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Train-specific endpoints
app.get('/api/trains/search', auth, async (req, res) => {
  try {
    const { from, to, date } = req.query;
    
    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, to, and date parameters are required' });
    }

    const IndianRailService = require('./services/IndianRailService');
    const railService = new IndianRailService();
    
    const trains = await railService.searchTrains(from, to, new Date(date));
    
    res.json({ trains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trains/history', auth, async (req, res) => {
  try {
    const trainResults = await prisma.trainResult.findMany({
      where: {
        trip: {
          userId: req.user.userId
        }
      },
      include: {
        trip: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({ trainResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});