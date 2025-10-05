const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth } = require('./auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('resourceType').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, resourceType, file, link } = req.body;
  // Debug: log incoming body to help verify link is being sent
  if (process.env.NODE_ENV !== 'production') {
    console.debug('POST /api/posts body:', JSON.stringify(req.body && typeof req.body === 'object' ? req.body : req.body?.toString?.() || req.body))
  }
  const author = req.user.email.split('@')[0];
  const authorEmail = req.user.email;
  const authorRole = req.user.role;

    // Rate limit for students: 1 post per week
  if (req.user.role === 'student') {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentPost = await Post.findOne({
      authorEmail: req.user.email,
      createdAt: { $gte: oneWeekAgo }
    });
    if (recentPost) {
      const remainingDays = Math.ceil((recentPost.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));
      return res.status(429).json({ message: `You can only post once per week. Please wait ${remainingDays} day(s).` });
    }
  }

    // Validate link posts
    if (resourceType === 'link' && (!link || !link.toString().trim())) {
      return res.status(400).json({ message: 'Please provide a valid link for resourceType "link".' });
    }

  try {
    // Validate file size if file is present (assuming base64 string)
    if (file) {
      const base64Data = file.data || file;
      // Remove data URI prefix if present
      const base64String = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
      const sizeInBytes = Buffer.byteLength(base64String, 'base64');
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (sizeInBytes > maxSize) {
        return res.status(400).json({ message: 'File size exceeds 100MB limit' });
      }
    }

    // Fix for file schema: store file as string (base64) instead of object
    const postData = {
      title,
      description,
      resourceType,
      author,
      authorEmail,
      authorRole,
      file: null,
      link: null,
    };

    if (file) {
      if (typeof file === 'string') {
        postData.file = file;
      } else if (file.data) {
        postData.file = file.data;
      }
    }

    if (link) {
      // store trimmed string link
      let normalized = typeof link === 'string' ? link.trim() : link.toString().trim();
      if (normalized) {
        const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(normalized)
        if (!hasScheme && !normalized.startsWith('//')) {
          normalized = 'https://' + normalized
        }
      }
      postData.link = normalized;
    }

    const post = new Post(postData);
    await post.save();
    // Debug: log saved post id and link
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Saved post:', JSON.stringify({ id: post._id, link: post.link }))
    }
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err)
    res.status(500).json({ message: 'Server error' });
  }
});

// Like post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likedBy = post.likedBy || [];
    const dislikedBy = post.dislikedBy || [];

    if (likedBy.includes(req.user.email)) return res.status(400).json({ message: 'Already liked' });

    const wasDisliked = dislikedBy.includes(req.user.email);
    likedBy.push(req.user.email);
    if (wasDisliked) {
      dislikedBy.splice(dislikedBy.indexOf(req.user.email), 1);
      post.dislikes = Math.max(0, post.dislikes - 1);
    }
    post.likes += 1;
    post.likedBy = likedBy;
    post.dislikedBy = dislikedBy;

    await post.save();
    await User.findOneAndUpdate({ email: post.authorEmail }, { $inc: { totalLikes: 1 } });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike post
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likedBy = post.likedBy || [];
    const dislikedBy = post.dislikedBy || [];

    if (dislikedBy.includes(req.user.email)) return res.status(400).json({ message: 'Already disliked' });

    const wasLiked = likedBy.includes(req.user.email);
    dislikedBy.push(req.user.email);
    if (wasLiked) {
      likedBy.splice(likedBy.indexOf(req.user.email), 1);
      post.likes = Math.max(0, post.likes - 1);
      await User.findOneAndUpdate({ email: post.authorEmail }, { $inc: { totalLikes: -1 } });
    }
    post.dislikes += 1;
    post.likedBy = likedBy;
    post.dislikedBy = dislikedBy;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment view
router.post('/:id/view', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
