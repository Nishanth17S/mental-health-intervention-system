const express = require('express');
const { Post, SupportGroup } = require('../models/PeerSupport');
const User = require('../models/User');
const router = express.Router();

// Get all posts with filtering
router.get('/posts', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    const posts = await Post.find(query)
      .populate('authorId', 'firstName lastName')
      .populate('moderatedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Get post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'firstName lastName')
      .populate('comments.authorId', 'firstName lastName')
      .populate('moderatedBy', 'firstName lastName');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

// Create new post
router.post('/posts', async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      isAnonymous
    } = req.body;
    
    const post = new Post({
      authorId: req.user.userId,
      title,
      content,
      category,
      tags,
      isAnonymous
    });
    
    await post.save();
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// Add comment to post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = {
      authorId: req.user.userId,
      content,
      isAnonymous
    };
    
    post.comments.push(comment);
    await post.save();
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

// Like post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user already liked
    const existingLike = post.likes.find(like => 
      like.userId.toString() === req.user.userId
    );
    
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    
    post.likes.push({
      userId: req.user.userId
    });
    
    await post.save();
    
    res.json({
      message: 'Post liked successfully',
      likes: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
});

// Moderate post (admin/moderator only)
router.put('/posts/:id/moderate', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.status = status;
    post.moderatedBy = req.user.userId;
    post.moderatedAt = new Date();
    post.moderationNotes = notes;
    
    await post.save();
    
    res.json({
      message: 'Post moderated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to moderate post', error: error.message });
  }
});

// Get support groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await SupportGroup.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .populate('moderators', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch support groups', error: error.message });
  }
});

// Create support group
router.post('/groups', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      isPrivate,
      maxMembers,
      rules
    } = req.body;
    
    const group = new SupportGroup({
      name,
      description,
      category,
      isPrivate,
      maxMembers,
      rules,
      createdBy: req.user.userId,
      moderators: [req.user.userId]
    });
    
    // Add creator as admin member
    group.members.push({
      userId: req.user.userId,
      role: 'admin'
    });
    
    await group.save();
    
    res.status(201).json({
      message: 'Support group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create support group', error: error.message });
  }
});

// Join support group
router.post('/groups/:id/join', async (req, res) => {
  try {
    const group = await SupportGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Support group not found' });
    }
    
    // Check if user is already a member
    const existingMember = group.members.find(member => 
      member.userId.toString() === req.user.userId
    );
    
    if (existingMember) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }
    
    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }
    
    group.members.push({
      userId: req.user.userId,
      role: 'member'
    });
    
    await group.save();
    
    res.json({
      message: 'Joined support group successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join support group', error: error.message });
  }
});

// Leave support group
router.post('/groups/:id/leave', async (req, res) => {
  try {
    const group = await SupportGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Support group not found' });
    }
    
    // Remove user from members
    group.members = group.members.filter(member => 
      member.userId.toString() !== req.user.userId
    );
    
    // Remove from moderators if applicable
    group.moderators = group.moderators.filter(moderator => 
      moderator.toString() !== req.user.userId
    );
    
    await group.save();
    
    res.json({
      message: 'Left support group successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave support group', error: error.message });
  }
});

// Get user's posts
router.get('/user/:userId/posts', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: error.message });
  }
});

// Get user's groups
router.get('/user/:userId/groups', async (req, res) => {
  try {
    const groups = await SupportGroup.find({
      'members.userId': req.params.userId
    });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user groups', error: error.message });
  }
});

module.exports = router;



