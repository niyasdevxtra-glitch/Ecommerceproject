exports.isauthenticated = (req, res, next) => {
  console.log("Session User:", req.session.user);
  console.log("Fallback Header (x-user-id):", req.headers['x-user-id']);

  try {
    // 1. Priority: Check full session object
    if (req.session && req.session.user) {
      return next();
    } 
    
    // 2. Fallback: Check custom header
    const fallbackId = req.headers['x-user-id'];
    if (fallbackId && fallbackId !== "undefined") {
      // Mock the session structure for controller compatibility
      req.session.user = { id: fallbackId };
      return next();
    }

    return res.status(401).json({ success: false, message: "Authentication failed. Please login again." });

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};
