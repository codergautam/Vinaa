import { userExists, createUser } from "@/server/db"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    })
  ],
  callbacks: {
    async jwt({ token }) {
      // save the username
      if (token) {
        token.username = token.email.split("@")[0]
        const fname = token.name.split(" ")[0]
        // format the name properly
        token.fname = fname[0].toUpperCase() + fname.slice(1).toLowerCase()
      }
      return token
    },
    async session({ session, token }) {
      session.username = token.username
      session.fname = token.fname

      let exists = await userExists(token.email);
      if (!exists) {
        let id = await createUser({ user: token.username, email: token.email, fname: token.fname })
        session.id = id;
      }
      return session
    }
  },
}

export default NextAuth(authOptions)
