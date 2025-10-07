const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const router = express.Router();

// Get available counselors
router.get('/counselors', async (req, res) => {
  try {
    const counselors = await User.find({ 
      role: 'counselor',
      isActive: true 
    }).select('firstName lastName email phone department');
    
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch counselors', error: error.message });
  }
});

// Get available time slots for a counselor
router.get('/availability/:counselorId', async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { date } = req.query;
    
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    // Get existing appointments for the day
    const existingAppointments = await Appointment.find({
      counselorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    // Generate available time slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(targetDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Check if slot is already booked
      const isBooked = existingAppointments.some(appointment => {
        const appointmentHour = appointment.appointmentDate.getHours();
        return appointmentHour === hour;
      });
      
      if (!isBooked) {
        availableSlots.push({
          time: slotTime.toISOString(),
          displayTime: slotTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        });
      }
    }
    
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
});

// Book an appointment
router.post('/book', async (req, res) => {
  try {
    const {
      studentId,
      counselorId,
      appointmentDate,
      reason,
      type = 'individual',
      mode = 'in-person',
      priority = 'medium'
    } = req.body;
    
    // Validate counselor exists
    const counselor = await User.findById(counselorId);
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(400).json({ message: 'Invalid counselor' });
    }
    
    // Check if time slot is still available
    const appointmentDateTime = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      counselorId,
      appointmentDate: appointmentDateTime,
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is no longer available' });
    }
    
    // Create new appointment
    const appointment = new Appointment({
      studentId,
      counselorId,
      appointmentDate: appointmentDateTime,
      reason,
      type,
      mode,
      priority,
      status: 'scheduled'
    });
    
    await appointment.save();
    
    // Populate appointment with user details
    await appointment.populate('studentId', 'firstName lastName email');
    await appointment.populate('counselorId', 'firstName lastName email');
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

// Get student's appointments
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const appointments = await Appointment.find({ studentId })
      .populate('counselorId', 'firstName lastName email phone')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Get counselor's appointments
router.get('/counselor/:counselorId', async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { date } = req.query;
    
    let query = { counselorId };
    
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      query.appointmentDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    const appointments = await Appointment.find(query)
      .populate('studentId', 'firstName lastName email phone')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Update appointment status
router.put('/:appointmentId/status', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    
    if (notes) {
      if (req.user.role === 'counselor') {
        appointment.counselorNotes = notes;
      } else {
        appointment.studentNotes = notes;
      }
    }
    
    if (status === 'completed') {
      appointment.followUpRequired = true;
      appointment.followUpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
    
    await appointment.save();
    
    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
  }
});

// Cancel appointment
router.put('/:appointmentId/cancel', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }
    
    appointment.status = 'cancelled';
    appointment.studentNotes = reason || 'Appointment cancelled';
    
    await appointment.save();
    
    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
});

// Reschedule appointment
router.put('/:appointmentId/reschedule', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { newDate, reason } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot reschedule completed appointment' });
    }
    
    // Check if new time slot is available
    const newAppointmentDate = new Date(newDate);
    const existingAppointment = await Appointment.findOne({
      counselorId: appointment.counselorId,
      appointmentDate: newAppointmentDate,
      _id: { $ne: appointmentId },
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'New time slot is not available' });
    }
    
    appointment.appointmentDate = newAppointmentDate;
    appointment.studentNotes = reason || 'Appointment rescheduled';
    
    await appointment.save();
    
    res.json({
      message: 'Appointment rescheduled successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reschedule appointment', error: error.message });
  }
});

// Submit appointment feedback
router.post('/:appointmentId/feedback', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { rating, comments } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Feedback can only be submitted for completed appointments' });
    }
    
    appointment.feedback = {
      rating,
      comments,
      submittedAt: new Date()
    };
    
    await appointment.save();
    
    res.json({
      message: 'Feedback submitted successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
});

module.exports = router;



