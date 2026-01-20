import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTToken.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

const FRONTEND_URL = "https://skillswap-rosy.vercel.app";

/* ---------------- GOOGLE STRATEGY ---------------- */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://skillswap-ab0o.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

/* ---------------- AUTH HANDLERS ---------------- */

export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: `${FRONTEND_URL}/login`,
  session: false,
});

/* ---------------- LOGIN CALLBACK ---------------- */

export const handleGoogleLoginCallback = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback ********");

  const email = req.user._json.email;

  /* ---------- REGISTERED USER ---------- */
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const jwtToken = generateJWTToken_username(existingUser);
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    res.cookie("accessToken", jwtToken, {
      httpOnly: true,
      expires: expiryDate,
      secure: true,        // REQUIRED on HTTPS
      sameSite: "none",    // REQUIRED for cross-site cookies
    });

    return res.redirect(`${FRONTEND_URL}/discover`);
  }

  /* ---------- UNREGISTERED USER ---------- */
  let unregisteredUser = await UnRegisteredUser.findOne({ email });

  if (!unregisteredUser) {
    unregisteredUser = await UnRegisteredUser.create({
      name: req.user._json.name,
      email,
      picture: req.user._json.picture,
    });
  }

  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

  res.cookie("accessTokenRegistration", jwtToken, {
    httpOnly: true,
    expires: expiryDate,
    secure: true,
    sameSite: "none",
  });

  return res.redirect(`${FRONTEND_URL}/register`);
});

/* ---------------- LOGOUT ---------------- */

export const handleLogout = (req, res) => {
  console.log("\n******** Inside handleLogout ********");

  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("accessTokenRegistration", {
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json(
    new ApiResponse(200, null, "User logged out successfully")
  );
};
