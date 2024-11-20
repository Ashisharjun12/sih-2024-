import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        
        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user if doesn't exist
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
          });
          return true;
        }

        // Update existing user's info if needed
        if (existingUser.image !== user.image || existingUser.name !== user.name) {
          await User.findOneAndUpdate(
            { email: user.email },
            { 
              $set: { 
                image: user.image,
                name: user.name,
              }
            }
          );
        }

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email })
            .select('role _id')
            .lean();
            
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id;
          }
        } catch (error) {
          console.error("JWT Callback Error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 