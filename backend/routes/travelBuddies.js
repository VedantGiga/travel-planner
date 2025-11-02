const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// Get all travel buddies
router.get('/travel-buddies', auth, async (req, res) => {
  try {
    const buddies = await prisma.user.findMany({
      where: {
        id: { not: req.user.id }
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      take: 20
    });

    res.json(buddies);
  } catch (error) {
    console.error('Error fetching travel buddies:', error);
    res.status(500).json({ error: 'Failed to fetch travel buddies' });
  }
});

// Send connection request
router.post('/connect', auth, async (req, res) => {
  try {
    const { buddyId } = req.body;
    
    // For now, just return success without database operation
    // TODO: Implement connection model in database
    const connection = { id: 'temp', senderId: req.user.id, receiverId: buddyId, status: 'pending' };

    res.json({ message: 'Connection request sent', connection });
  } catch (error) {
    console.error('Error sending connection:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
});

module.exports = router;