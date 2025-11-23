import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { Pool } from "pg"
import dotenv from "dotenv";
dotenv.config();


const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },

  trustedOrigins: ["http://localhost:5173"],

  plugins: [
    jwt()
  ],
})

export default auth
