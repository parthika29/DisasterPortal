const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Request = require('../models/request');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddleware');


router.get('/dashboard', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const requests = await Request.find().populate('createdBy assignedVolunteer');
    const volunteers = await User.find({ role: 'volunteer' });

    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      assigned: requests.filter(r => r.status === 'Assigned').length,
      resolved: requests.filter(r => r.status === 'Resolved').length,
    };

    res.render('admin/dashboard', {
      user: req.user,
      requests,
      volunteers,
      stats
    });
  } catch (err) {
    console.error("Error loading admin dashboard:", err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

router.post('/approve-volunteer/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const volunteer = await User.findById(req.params.id);
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    volunteer.approved = true;
    await volunteer.save();

    res.json({ success: true, message: 'Volunteer approved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error approving volunteer' });
  }
});


router.delete('/reject-volunteer/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    res.json({ success: true, message: 'Volunteer rejected and deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error rejecting volunteer' });
  }
});


router.post('/assign/:requestId', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { volunteerId } = req.body;

    const request = await Request.findById(req.params.requestId);
    const volunteer = await User.findById(volunteerId);

    if (!request || !volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ success: false, message: 'Invalid request or volunteer' });
    }

    request.status = 'Assigned';
    request.assignedVolunteer = volunteerId;
    await request.save();

    res.json({ success: true, message: 'Volunteer assigned to request' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error assigning volunteer' });
  }
});

module.exports = router;
