const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['victim', 'volunteer', 'admin'],
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
   address: {
    type: String,
    // required: function () {
    //   return this.role === 'victim'; // ✅ address required only for victims
    //}
  },
  approved: {
    type: Boolean,
    default: false // Only for volunteers
  }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
