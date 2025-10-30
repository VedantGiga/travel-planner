const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const prisma = require('./lib/prisma');
const auth = require('./middleware/auth');
const OrchestratorAgent = require('./agents/OrchestratorAgent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const orchestrator = new OrchestratorAgent();

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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

// Forgot password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #2A7FFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
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

app.delete('/api/trips/all', auth, async (req, res) => {
  try {
    await prisma.trip.deleteMany({
      where: { userId: req.user.userId }
    });
    res.json({ message: 'All trips deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/trips/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.user.userId }
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted successfully' });
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

    const planningResult = await orchestrator.processRequest(message, req.user.userId);
    
    // Save trip to database
    const trip = await prisma.trip.create({
      data: {
        title: `Trip to ${planningResult.intent.destination}`,
        description: message,
        destination: planningResult.intent.destination,
        startDate: new Date(),
        endDate: new Date(Date.now() + planningResult.intent.duration * 24 * 60 * 60 * 1000),
        budget: planningResult.totalBudget.estimatedCost || planningResult.intent.budget,
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