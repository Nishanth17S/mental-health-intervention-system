const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// Get all resources with filtering
router.get('/', async (req, res) => {
  try {
    const { category, type, language, difficulty, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const resources = await Resource.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment view count
    resource.views += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resource', error: error.message });
  }
});

// Create new resource (admin/counselor only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      language,
      content,
      tags,
      difficulty,
      targetAudience
    } = req.body;
    
    const resource = new Resource({
      title,
      description,
      type,
      category,
      language,
      content,
      tags,
      difficulty,
      targetAudience,
      createdBy: req.user.userId
    });
    
    await resource.save();
    
    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resource', error: error.message });
  }
});

// Update resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user has permission to update
    if (resource.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }
    
    const updates = req.body;
    delete updates.createdBy; // Don't allow changing creator
    delete updates.views; // Don't allow changing view count
    
    Object.assign(resource, updates);
    await resource.save();
    
    res.json({
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update resource', error: error.message });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user has permission to delete
    if (resource.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource', error: error.message });
  }
});

// Rate resource
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Update rating
    const newAverage = ((resource.rating.average * resource.rating.count) + rating) / (resource.rating.count + 1);
    
    resource.rating.average = newAverage;
    resource.rating.count += 1;
    
    await resource.save();
    
    res.json({
      message: 'Rating submitted successfully',
      rating: resource.rating
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rating', error: error.message });
  }
});

// Like resource
router.post('/:id/like', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    resource.likes += 1;
    await resource.save();
    
    res.json({
      message: 'Resource liked successfully',
      likes: resource.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like resource', error: error.message });
  }
});

// Get resource categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Resource.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// Get resource types
router.get('/types/list', async (req, res) => {
  try {
    const types = await Resource.distinct('type', { isActive: true });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch types', error: error.message });
  }
});

// Get popular resources
router.get('/popular/list', async (req, res) => {
  try {
    const popularResources = await Resource.find({ isActive: true })
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .select('title description type category views likes rating');
    
    res.json(popularResources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch popular resources', error: error.message });
  }
});

module.exports = router;



