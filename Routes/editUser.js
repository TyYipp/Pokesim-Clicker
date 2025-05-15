const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Adjust path if needed

// Route to display the edit user form
router.get('/users/:id/edit', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    // Render the view from admin folder
    res.render('admin/editUser', { user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Route to handle updating user data
router.post('/users/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.redirect('/admin/manage-users');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Route to handle user deletion
router.post('/users/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found!' });
    }
    res.redirect('/admin/manage-users');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
