const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

router.get('/register', (req, res) => {
  res.render('register', { error: null, message: null });
});


router.get('/login', (req, res) => {
  res.render('login', { error: null, message: null });
});


router.post('/register', async (req, res) => {
  const { name, email, password, role, pincode, adminCode } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('register', { error: 'User already exists', message: null });
    }

    if (role === 'admin' && adminCode !== process.env.ADMIN_SECRET) {
      return res.render('register', { error: 'Invalid Admin Secret Code', message: null });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name,
      email,
      password: hashed,
      role,
      pincode,
      isApproved: role === 'victim' ? true : false,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.cookie('token', token, { httpOnly: true });

    if (newUser.role === 'victim') return res.redirect('/victim/dashboard');
    if (newUser.role === 'volunteer') return res.redirect('/volunteer/dashboard');
    if (newUser.role === 'admin') return res.redirect('/admin/dashboard');

  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error registering user', message: null });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'User not found', message: null });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid credentials', message: null });
    }

  

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });

    if (user.role === 'victim') return res.redirect('/victim/dashboard');
    if (user.role === 'volunteer') return res.redirect('/volunteer/dashboard');
    if (user.role === 'admin') return res.redirect('/admin/dashboard');

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error logging in', message: null });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/');  
});

module.exports = router;
