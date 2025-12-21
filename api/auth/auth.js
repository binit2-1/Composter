import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { Pool } from "pg"
import dotenv from "dotenv";
import { sendEmail } from "../lib/sendEmail.js";
import { emailContent } from "../lib/constants/emailContent.js";
dotenv.config();

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const AUTH_BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  baseURL: AUTH_BASE_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({user, url, token}, request) => {
      sendEmail({
        to: user.email,
        subject: "Composter Password Reset",
        html: emailContent(url)
      })
    },
    onPasswordReset: async ({user}, request) => {
      console.info(`Password reset for user: ${user.email} successful.`);
    }
  },

  trustedOrigins: [
    "http://localhost:5173",
    "https://composter.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean),

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  advanced: {
    // Only use secure cookies in production (HTTPS)
    useSecureCookies: isProduction,
    cookies: {
      session_token: {
        name: isProduction ? "__Secure-better-auth.session_token" : "better-auth.session_token",
        attributes: {
          httpOnly: true,
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction,
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        }
      },
      session_data: {
        name: isProduction ? "__Secure-better-auth.session_data" : "better-auth.session_data",
        attributes: {
          httpOnly: true,
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction,
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        }
      }
    }
  },

  plugins: [
    jwt({
      // JWT issuer/audience must match what we verify against in authMiddleware
      issuer: AUTH_BASE_URL,
      audience: AUTH_BASE_URL,
      expirationTime: "30d", // 30 days to match session
    })
  ],
})

export default auth;
