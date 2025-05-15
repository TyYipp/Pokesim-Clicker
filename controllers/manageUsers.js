const User = require('../models/User'); // Adjust the path as needed

exports.manageUsers = async (req, res) => {
  try {
    // Fetch users from MongoDB with .lean() to return plain JavaScript objects
    const users = await User.find().lean(); 
    
    // Log the fetched users to see their structure
    console.log('Fetched users:', JSON.stringify(users, null, 2)); // Inspect the structure of users

    // Map over the fetched users and ensure each is a plain JavaScript object
    const plainUsers = users.map(user => user.toObject ? user.toObject() : user);
    
    // Pass the plain users to the Handlebars template
    res.render('admin/manageUsers', { users: plainUsers });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Unable to fetch users', details: err.message });
  }
};
