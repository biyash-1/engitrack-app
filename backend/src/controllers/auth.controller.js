const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

const getCookieOptions = (maxAgeMs) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  };
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 14);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer",
      subscription: "free_trial",
      subscription_expires_at: trialExpiry,
    });

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    res.status(201).json({
      message: "Registration successful.",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.is_active) {
      return res
        .status(403)
        .json({ message: "Account has been deactivated. Contact admin." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const log = new LoginLog({
      user_id: user._id,
      ip_address: req.ip || req.connection.remoteAddress || "",
      user_agent: req.headers["user-agent"] || "",
      action: "login",
    });
    await log.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    res.json({
      message: "Login successful.",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const me = (req, res) => {
  res.json({ user: req.user });
};

const refreshToken = async (req, res) => {
  try {
    let token = req.cookies?.refreshToken;
    if (!token) {
      token = req.body.refreshToken;
    }

    if (!token) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie(
      "refreshToken",
      newRefreshToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(401).json({ message: "Invalid refresh token." });
  }
};

const logout = async (req, res) => {
  try {
    if (req.user) {
      const log = new LoginLog({
        user_id: req.user.id,
        ip_address: req.ip || req.connection.remoteAddress || "",
        user_agent: req.headers["user-agent"] || "",
        action: "logout",
      });
      await log.save();
    }

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const upgradeSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id;

    if (!["free_trial", "professional", "enterprise"].includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription plan." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let expiresAt = null;
    if (subscription === "free_trial") {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      expiresAt = expiry;
    } else if (subscription === "professional") {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      expiresAt = expiry;
    } else if (subscription === "enterprise") {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 365);
      expiresAt = expiry;
    }

    user.subscription = subscription;
    user.subscription_expires_at = expiresAt;
    await user.save();

    res.json({ message: "Subscription upgraded successfully.", user });
  } catch (error) {
    console.error("Upgrade subscription error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  register,
  login,
  me,
  refreshToken,
  logout,
  upgradeSubscription,
};
