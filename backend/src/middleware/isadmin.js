exports.isadmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admins can access this page" });
  }

  next();
};
