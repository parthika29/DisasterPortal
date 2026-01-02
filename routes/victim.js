const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

const Request = require('../models/request');
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });


router.get('/dashboard', authenticateJWT, authorizeRoles('victim'), async (req, res) => {
  const requests = await Request.find({ victim: req.user._id }).sort({ createdAt: -1 });
  res.render('victim/dashboard', { user: req.user, requests });
});


router.post(
  '/request',
  authenticateJWT,
  authorizeRoles('victim'),
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, type, description, pincode,address, urgency } = req.body;

      const request = new Request({
        victim: req.user._id,
        createdBy: req.user._id,
        title,
        type,
        description,
        pincode,
        address,
        urgency,
        image: req.file ? req.file.path : null
      });

      await request.save();
      res.redirect('/victim/dashboard'); 
    } catch (err) {
      console.error('Error creating request:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
