const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Edit User Route (GET to display form)
router.get("/users/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    // Render the view from the correct path (admin folder)
    res.render("admin/editUser", { user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Update User Route (POST to handle form submission)
router.post("/users/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Redirect to the user management page after successful update
    res.redirect("/admin/manage-users");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
