import NextAuth from "next-auth"
import authConfig from "@/auth.config"

import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"
import { getUserById } from "./lib/db/data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./lib/db/data/twofactor-confirmation"



export const { handlers , auth, signIn, signOut } = NextAuth({
    pages : {
        signIn : "/auth/login",
        error :  "/auth/error"
    },

    events : {
        async linkAccount({user}){
            await db.user.update({
                where : { id: user.id},
                data : { emailVerified : new Date() }
            })
        }
    },
    callbacks : {
        async signIn({user, account}){
            if(user.email === "ko@gmail.com") return false;
            if(account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);
            
            if(!existingUser || !existingUser?.emailVerified) return false;
            
            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if (!twoFactorConfirmation) return false;

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }
            

            return true;
        },

        async jwt({ token }) {
            if(!token.sub) return token;
            
            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            
            return token
        },

        async session({token, session}){
          if(session.user && token.sub) session.user.id = token.sub;
          if(token.role && session.user) session.user.role = token.role as UserRole;
          if(session.user) session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
          return session;
        }

    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})