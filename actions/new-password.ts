"use server";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getResetTokenByToken } from "@/lib/db/data/reset-token";
import { getUserByEmail } from "@/lib/db/data/user";
import db from "@/lib/db"

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {

  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if(!validatedFields.success){
    return {error : "Invalid field !"}
  }

  const { password } = validatedFields.data;

  const existingToken = await getResetTokenByToken(token);

  if(!existingToken){
    return {error : "Invalid token !"};
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where : {id : existingUser.id},
    data : {password}
  })

  await db.passwordResetToken.delete({
    where : {id : existingToken.id}
  })

  return { success : "Password updated!"}
};
