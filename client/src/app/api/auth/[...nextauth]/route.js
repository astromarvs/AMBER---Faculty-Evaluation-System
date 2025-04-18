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

          const user = await response.json();

          if (response.ok && user) {
            return {
              id: user.id,
              token: user.token,
              userName: user.userName,
              firstName: user.firstName,    // Added first name
              lastName: user.lastName,       // Added last name
              email: user.email              // Added email
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
        token.userName = user.userName;
        token.firstName = user.firstName;    // Added first name to token
        token.lastName = user.lastName;      // Added last name to token
        token.email = user.email;            // Added email to token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.userName = token.userName;
      session.user.firstName = token.firstName;  // Added first name to session
      session.user.lastName = token.lastName;    // Added last name to session
      session.user.email = token.email;          // Added email to session
      session.user.name = `${token.firstName} ${token.lastName}`; // Combined full name
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