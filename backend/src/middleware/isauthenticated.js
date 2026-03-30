exports.isauthenticated = (req, res, next) => {
  console.log("Session User:", req.session.user);
  try {
    if (req.session && req.session.user) {
      next();
    } else {
      return res.status(401).json({ success: false, message: "Please login first !!!" })
    }
  } catch (error) {
    console.error(error.message)
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};
