// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email }).select('+password');  // Select password explicitly
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if the password matches using the matchPassword method
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token including the role
      const token = jwt.sign(
        { userId: user._id, username: user.name, role: user.role },  // Include role in the JWT payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  // Token expiration time
      );
  
      return res.json({
        message: 'Login successful',
        token,
        user: { name: user.name, email: user.email, role: user.role },  // Include role in response
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  