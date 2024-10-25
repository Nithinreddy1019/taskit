import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import * as bcrypt from "bcryptjs";

import { db } from "./lib/db";
import { signInSchema } from "./features/auth/schemas/signin-schema";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    // WIP: Add OAuth
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
    }
  },
  pages: {
    signIn: "/sign-in"
  }
})