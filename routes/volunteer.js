const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const Request = require('../models/request');

// Volunteer Dashboard
router.get('/dashboard', authenticateJWT, authorizeRoles('volunteer'), async (req, res) => {
  const requests = await Request.find({ status: 'Pending' }).sort({ createdAt: -1 });
  const myRequests = await Request.find({ assignedVolunteer: req.user._id }).sort({ updatedAt: -1 });

  res.render('volunteer/dashboard', { user: req.user, requests, myRequests });
});

// Accept a Task
router.post('/accept/:id', authenticateJWT, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'Pending') return res.status(400).json({ error: 'Request already taken' });

    request.assignedVolunteer = req.user._id;
    request.status = 'Accepted';
    await request.save();

    res.json({ success: true, message: 'Task accepted successfully!' });
  } catch (err) {
    console.error('Error accepting task:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
