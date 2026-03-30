const User = require('../models/user_model');

exports.isadmin = async (req, res, next) => {
  try {
    // 1. Check existing session from isauthenticated middleware
    if (req.session?.user?.role === "admin") {
      return next();
    }

    // 2. Fallback: Check header + Database verify
    const userId = req.session?.user?.id || req.headers['x-user-id'];
    
    if (userId && userId !== "undefined") {
      const user = await User.findById(userId);
      if (user && user.role === "admin") {
        // Hydrate session for downstream handlers
        req.session.user = { 
          id: user._id.toString(), 
          role: user.role, 
          username: user.username 
        };
        return next();
      }
    }

    return res.status(403).json({ success: false, message: "Only admins can access this page" });
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during authorization" });
  }
};
