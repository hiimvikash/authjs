"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/lib/db/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/generatetoken";
import { sendTwoFactorTokenMail, sendVerificationMail } from "@/lib/sendmail";
import { getTwoFactorTokenByEmail } from "@/lib/db/data/twofactor-token";
import db from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/lib/db/data/twofactor-confirmation";

type LoginResponse = {
  error?: string
  success? : string
  twoFactor?: boolean
} | void;


export const login = async (values: z.infer<typeof LoginSchema>) : Promise<LoginResponse> =>  {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {email, password, code} = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser) return { error : "Invalid Credentials"};
  if(!existingUser.emailVerified){
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationMail(verificationToken.email, verificationToken.token);
    return {success : "Confirmation mail sent, verify to continue."}
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if(!twoFactorToken || twoFactorToken.token !== code) return {error : "Invalid code !"}

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if(hasExpired) return {error : "Code expired !"}

      await db.twoFactorToken.delete({
        where : { id : twoFactorToken.id}
      })

      const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if(existingTwoFactorConfirmation){
        await db.twoFactorConfirmation.delete({
          where : {id : existingTwoFactorConfirmation.id}
        })
      }

      await db.twoFactorConfirmation.create({
        data : {
          userId : existingUser.id
        }
      })


    }
    else{
    const twoFactorToken = await generateTwoFactorToken (existingUser.email)
    await  sendTwoFactorTokenMail(twoFactorToken.email, twoFactorToken.token);
    return { twoFactor: true }; 
    }
  }


  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo : DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
    if(error instanceof AuthError){
      switch (error.type) {
        case "AccessDenied":
          return {error : "Access denied ! contact admin."}
        case "CredentialsSignin": 
          return {error : "Invalid Credentials !"}
        default: return {error : "Something went wrong !"}
      }
    }
    throw error;
  }
};
