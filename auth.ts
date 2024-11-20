import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter";
import * as bcrypt from "bcryptjs";

import { db } from "./lib/db";
import { signInSchema } from "./features/auth/schemas/signin-schema";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    // WIP: Add OAuth
    Google({  
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);
        
        if(validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { email }
          });
          if(!user || !user.password ) return null;

          const passwordmatch = await bcrypt.compare(password, user.password);

          if(passwordmatch) return user;

        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if(token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async signIn({ profile, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (profile?.email) {
          // Set emailVerified to true for OAuth providers
          profile.emailVerified = true;
          return true;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/sign-in"
  }
})