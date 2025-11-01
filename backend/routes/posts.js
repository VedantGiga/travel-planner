const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// Get all posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, image, tags } = req.body;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        tags: tags || [],
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
