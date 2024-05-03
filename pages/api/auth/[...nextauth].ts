import NextAuth, { NextAuthOptions, User as UserN } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {User} from "@/components/dashboard_components/users-permissions/UsersPermissionsList";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userData: any = {
          id: req?.body?._id,
          name: `${req?.body?.firstName} ${req?.body?.lastName}`,
          email: req?.body?.email,
          type: req?.body?.type,
          permissions: JSON.parse(req?.body?.permissions),
          jwt: req?.body?.jwt,
        };

        if (userData) {
          return { ...userData };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      const newAccount: any = user;
      if (account) {
        token.id = newAccount._id;
        token.jwt = newAccount.jwt;
        token.user = user;
      }

      return token;
    },
    async session({ session, token, user }) {
      session = { ...session, user: token.user as User & UserN };
      return { ...session };
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions)
