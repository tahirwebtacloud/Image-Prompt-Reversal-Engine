import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getOrCreateUser, getUserByEmail } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          await getOrCreateUser({
            googleId: profile.sub as string,
            email: user.email as string,
            name: user.name as string,
            avatarUrl: user.image as string,
          });
          return true;
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await getUserByEmail(session.user.email);
        if (dbUser) {
          session.user.id = String(dbUser.id);
        }
      }
      return session;
    },
  },
  trustHost: true,
});
