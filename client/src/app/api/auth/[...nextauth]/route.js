import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch('http://localhost:5000/api/admin/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: credentials.userName,
              password: credentials.password
            }),
          });

          const data = await response.json();

          if (response.ok && data.token) {
            return {
              token: data.token,  // Token from root
              id: data.user.id,
              firstName: data.user.first_name,  // Matches API response
              lastName: data.user.last_name,    // Matches API response
              email: data.user.email,
              userName: data.user.username,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = `${token.firstName} ${token.lastName}`;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.email = token.email;
      session.user.userName = token.userName;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };