import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } = authClient;
