const express = require('express');
const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const Appointment = require('../models/Appointment');
const { ScreeningResult } = require('../models/Screening');
const { Post } = require('../models/PeerSupport');
const Resource = require('../models/Resource');
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Dashboard statistics
router.get('/dashboard/stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalCounselors,
      totalAppointments,
      totalChatSessions,
      totalScreeningResults,
      totalPosts,
      totalResources
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'counselor' }),
      Appointment.countDocuments(),
      ChatSession.countDocuments(),
      ScreeningResult.countDocuments(),
      Post.countDocuments(),
      Resource.countDocuments()
    ]);
    
    // Recent activity
    const recentAppointments = await Appointment.find()
      .populate('studentId', 'firstName lastName')
      .populate('counselorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentScreeningResults = await ScreeningResult.find()
      .populate('userId', 'firstName lastName')
      .sort({ completedAt: -1 })
      .limit(5);
    
    // Risk level distribution
    const riskDistribution = await ChatSession.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Severity distribution from screening
    const severityDistribution = await ScreeningResult.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      overview: {
        totalUsers,
        totalCounselors,
        totalAppointments,
        totalChatSessions,
        totalScreeningResults,
        totalPosts,
        totalResources
      },
      recentActivity: {
        appointments: recentAppointments,
        screeningResults: recentScreeningResults
      },
      distributions: {
        riskLevels: riskDistribution,
        severityLevels: severityDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

// User management
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Update user status
router.put('/users/:id/status', requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
});

// Analytics - Chat sessions
router.get('/analytics/chat-sessions', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const sessions = await ChatSession.find(dateFilter);
    
    // Group by date
    const dailyStats = sessions.reduce((acc, session) => {
      const date = session.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { total: 0, escalated: 0, resolved: 0 };
      }
      acc[date].total++;
      if (session.status === 'escalated') acc[date].escalated++;
      if (session.status === 'resolved') acc[date].resolved++;
      return acc;
    }, {});
    
    // Risk level distribution
    const riskStats = sessions.reduce((acc, session) => {
      acc[session.riskLevel] = (acc[session.riskLevel] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      dailyStats,
      riskStats,
      totalSessions: sessions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat analytics', error: error.message });
  }
});

// Analytics - Appointments
router.get('/analytics/appointments', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const appointments = await Appointment.find(dateFilter);
    
    // Status distribution
    const statusStats = appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});
    
    // Monthly trends
    const monthlyStats = appointments.reduce((acc, appointment) => {
      const month = appointment.appointmentDate.toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { total: 0, completed: 0, cancelled: 0 };
      }
      acc[month].total++;
      if (appointment.status === 'completed') acc[month].completed++;
      if (appointment.status === 'cancelled') acc[month].cancelled++;
      return acc;
    }, {});
    
    res.json({
      statusStats,
      monthlyStats,
      totalAppointments: appointments.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointment analytics', error: error.message });
  }
});

// Analytics - Screening results
router.get('/analytics/screening', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const results = await ScreeningResult.find(dateFilter);
    
    // Severity distribution by screening type
    const severityByType = results.reduce((acc, result) => {
      if (!acc[result.screeningType]) {
        acc[result.screeningType] = {};
      }
      acc[result.screeningType][result.severity] = (acc[result.screeningType][result.severity] || 0) + 1;
      return acc;
    }, {});
    
    // Follow-up required stats
    const followUpStats = results.reduce((acc, result) => {
      if (result.followUpRequired) {
        acc.required++;
      } else {
        acc.notRequired++;
      }
      return acc;
    }, { required: 0, notRequired: 0 });
    
    res.json({
      severityByType,
      followUpStats,
      totalResults: results.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch screening analytics', error: error.message });
  }
});

// System health check
router.get('/system/health', requireAdmin, async (req, res) => {
  try {
    const health = {
      database: 'connected',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: 'Health check failed', error: error.message });
  }
});

// Export data
router.get('/export/:type', requireAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let data = [];
    
    switch (type) {
      case 'users':
        data = await User.find(dateFilter).select('-password');
        break;
      case 'appointments':
        data = await Appointment.find(dateFilter)
          .populate('studentId', 'firstName lastName email')
          .populate('counselorId', 'firstName lastName email');
        break;
      case 'screening':
        data = await ScreeningResult.find(dateFilter)
          .populate('userId', 'firstName lastName email');
        break;
      case 'chat-sessions':
        data = await ChatSession.find(dateFilter)
          .populate('userId', 'firstName lastName email');
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }
    
    res.json({
      type,
      count: data.length,
      data,
      exportedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export data', error: error.message });
  }
});

module.exports = router;



