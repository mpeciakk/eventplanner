import {
  type NextAuthOptions, getServerSession,
} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "~/server/db"
import { type GetServerSidePropsContext } from "next"
import bcrypt from "bcrypt"

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    isAdmin: boolean;
  }

  interface Session {
    user: User
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) return session

      const user = await prisma.user.findFirst({
        where: {
          id: parseInt(token.sub),
        },
      })
      if (user) session.user = user

      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) return null

        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        })

        if (!user) return null
        if (!await bcrypt.compare(credentials.password, user.password)) return null

        return {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        }
      },
    }),
  ],
}
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
