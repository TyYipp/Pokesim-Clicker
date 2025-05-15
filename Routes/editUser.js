const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Adjust the path to your User model

// Route to display the edit user form
router.get('/users/:id/edit', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);  // Find the user by their ID
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('editUser', { user: user });  // Render the editUser template
  } catch (err) {
    res.status(500).send('Error fetching user: ' + err.message);
  }
});

// Route to handle updating user data
router.post('/users/:id/update', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }  // Return the updated user object
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/admin/manage-users');  // Redirect to manage users after update
  } catch (err) {
    res.status(500).send('Error updating user: ' + err.message);
  }
});

// Route to handle user deletion
router.post('/users/:id/delete', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).send('User not found');
    }
    res.redirect('/admin/manage-users');  // Redirect to manage users after deletion
  } catch (err) {
    res.status(500).send('Error deleting user: ' + err.message);
  }
});

module.exports = router;
