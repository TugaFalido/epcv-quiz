import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        // This is just a placeholder example
        if (credentials?.username === "user" && credentials?.password === "pass") {
          return { id: "1", name: "Test User", email: "user@example.com" };
        }
        return null;
      }
    }),
  ],
  // Add other configuration options as needed
  session: {
    strategy: "jwt",
  },
  // ... other options
};