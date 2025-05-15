exports.manageUsers = async (req, res) => {
    try {
      const users = await User.find();
      console.log('Fetched users:', users); // Debugging: Check what users are fetched
      res.render('admin/manageUsers', { users });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Unable to fetch users', details: err.message });
    }
  };
  