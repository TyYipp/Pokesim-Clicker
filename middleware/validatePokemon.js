function validatePokemon(req, res, next) {
    const { name, multiplier, image } = req.body;
  
    // Check required fields
    if (!name || multiplier === undefined || !image) {
      return res.status(400).json({
        error: "Missing required fields: name, multiplier, or image",
      });
    }
  
    // Type checks
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }
  
    if (typeof multiplier !== "number" || !isFinite(multiplier)) {
      return res.status(400).json({ error: "Multiplier must be a number" });
    }
  
    if (typeof image !== "string") {
      return res.status(400).json({ error: "Image must be a string (URL or path)" });
    }
  
    // Optional checks
    if (name.length > 50) {
      return res.status(400).json({ error: "Name must be 50 characters or less" });
    }
  
    if (multiplier <= 0) {
      return res.status(400).json({ error: "Multiplier must be greater than 0" });
    }
  
    next();
  }
  
  module.exports = validatePokemon;
  