const adminAuth = (req, res, next) => {
  // real auth would eventually go here (token/role/etc.)
  next();
};

module.exports = adminAuth;