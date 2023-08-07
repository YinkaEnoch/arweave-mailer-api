const ValidateRequestBody = async (req, res, next) => {
  // First Name
  if (!req.body.firstName) {
    return res
      .status(400)
      .json({ error: true, message: "firstName is required" });
  }

  if (typeof req.body.firstName !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "firstName must be a string" });
  }

  // Email
  if (!req.body.email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }

  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!req.body.email.match(validRegex)) {
    return res
      .status(400)
      .json({ error: true, message: "email must be a valid email address" });
  }

  // Wallet Address
  if (!req.body.walletAddress) {
    return res
      .status(400)
      .json({ error: true, message: "walletAddress is required" });
  }

  if (typeof req.body.walletAddress !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "walletAddress must be a string" });
  }

  next();
};

module.exports = ValidateRequestBody;
