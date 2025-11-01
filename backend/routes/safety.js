const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Scam Detection
router.post('/safety/analyze-scam', auth, async (req, res) => {
  try {
    const { description, amount, location, category } = req.body;

    const prompt = `Analyze this potential travel scam:
Category: ${category}
Location: ${location}
Amount: ${amount || 'N/A'}
Description: ${description}

Determine:
1. Is this likely a scam? (Yes/No/Maybe)
2. Risk level (Low/Medium/High/Critical)
3. Brief explanation (2-3 sentences)
4. Safety recommendation

Respond in JSON format: {"isScam": "Yes/No/Maybe", "riskLevel": "Low/Medium/High/Critical", "explanation": "...", "recommendation": "..."}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 500
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing scam:', error);
    res.status(500).json({ error: 'Failed to analyze scam' });
  }
});

// Report Safety Issue
router.post('/safety/report', auth, async (req, res) => {
  try {
    const { type, title, description, location, latitude, longitude, severity } = req.body;

    const report = await prisma.safetyReport.create({
      data: {
        type,
        title,
        description,
        location,
        latitude,
        longitude,
        severity,
        userId: req.user.id
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Get Nearby Safety Reports
router.get('/safety/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Simple bounding box calculation
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    const reports = await prisma.safetyReport.findMany({
      where: {
        latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
        longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta }
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching nearby reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Upvote Report
router.post('/safety/upvote/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.safetyReport.update({
      where: { id },
      data: { upvotes: { increment: 1 } }
    });

    res.json(report);
  } catch (error) {
    console.error('Error upvoting report:', error);
    res.status(500).json({ error: 'Failed to upvote report' });
  }
});

// Get Safety Heatmap Data
router.get('/safety/heatmap', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    const reports = await prisma.safetyReport.findMany({
      where: {
        latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
        longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta }
      },
      select: {
        latitude: true,
        longitude: true,
        type: true,
        severity: true,
        upvotes: true
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

module.exports = router;
